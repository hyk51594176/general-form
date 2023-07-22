/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-restricted-syntax */
// ported from https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/src/apiWatch.ts by Evan You

import type {
  ComputedRef,
  EffectScheduler,
  ReactiveEffectOptions,
  Ref
} from '@vue/reactivity'
import { ReactiveEffect, isReactive, isRef, isShallow } from '@vue/reactivity'
import {
  NOOP,
  hasChanged,
  isArray,
  isFunction,
  isObject,
  isSet,
  isMap,
  isPlainObject
} from '@vue/shared'
import {
  callWithAsyncErrorHandling,
  callWithErrorHandling,
  warn
} from './errorHandling'
import { queueJob } from './scheduler'

export type WatchEffect = (onInvalidate: InvalidateCbRegistrator) => void

export type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T)

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onInvalidate: InvalidateCbRegistrator
) => any

export type WatchStopHandle = () => void

type OnCleanup = (cleanupFn: () => void) => void

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? V
    : T[K] extends object
    ? T[K]
    : never
}

type MapOldSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : T[K] extends object
    ? Immediate extends true
      ? T[K] | undefined
      : T[K]
    : never
}

type InvalidateCbRegistrator = (cb: () => void) => void
const INITIAL_WATCHER_VALUE = {}

export interface WatchOptionsBase {
  /**
   * @depreacted ignored in `@vue-reactivity/watch` and will always be `sync`
   */
  flush?: 'sync' | 'pre' | 'post'
  onTrack?: ReactiveEffectOptions['onTrack']
  onTrigger?: ReactiveEffectOptions['onTrigger']
}

export interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
  immediate?: Immediate
  deep?: boolean
}

interface SchedulerJob extends Function {
  id?: number
  active?: boolean
  computed?: boolean
  /**
   * Indicates whether the effect is allowed to recursively trigger itself
   * when managed by the scheduler.
   *
   * By default, a job cannot trigger itself because some built-in method calls,
   * e.g. Array.prototype.push actually performs reads as well (#1740) which
   * can lead to confusing infinite loops.
   * The allowed cases are component update functions and watch callbacks.
   * Component update functions may update child component props, which in turn
   * trigger flush: "pre" watch callbacks that mutates state that the parent
   * relies on (#1801). Watch callbacks doesn't track its dependencies so if it
   * triggers itself again, it's likely intentional and it is the user's
   * responsibility to perform recursive state mutation that eventually
   * stabilizes (#1727).
   */
  allowRecurse?: boolean
}

// Simple effect.
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle {
  return doWatch(effect, null, options)
}

// overload #1: array of multiple sources + cb
// Readonly constraint helps the callback to correctly infer value types based
// on position in the source array. Otherwise the values will get a union type
// of all possible value types.
export function watch<
  T extends Readonly<Array<WatchSource<unknown> | object>>,
  Immediate extends Readonly<boolean> = false
>(
  sources: T,
  cb: WatchCallback<MapSources<T>, MapOldSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload #2: single source + cb
export function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload #3: watching reactive object w/ cb
export function watch<
  T extends object,
  Immediate extends Readonly<boolean> = false
>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// implementation
export function watch<T = any>(
  source: WatchSource<T> | WatchSource<T>[],
  cb: WatchCallback<T>,
  options?: WatchOptions
): WatchStopHandle {
  return doWatch(source, cb, options)
}

function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  { immediate, deep, flush }: WatchOptions = {}
): WatchStopHandle {
  let getter: () => any
  let forceTrigger = false
  let isMultiSource = false

  if (isRef(source)) {
    getter = () => source.value
    forceTrigger = isShallow(source)
  } else if (isReactive(source)) {
    getter = () => source
    deep = true
  } else if (isArray(source)) {
    isMultiSource = true
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s))
    getter = () =>
      source.map((s) => {
        if (isRef(s)) return s.value

        if (isReactive(s)) return traverse(s)

        if (isFunction(s)) return callWithErrorHandling(s, 'watch getter')

        return warn('invalid source')
      })
  } else if (isFunction(source)) {
    if (cb) {
      // getter with cb
      getter = () => callWithErrorHandling(source, 'watch getter')
    } else {
      // no cb -> simple effect
      getter = () => {
        if (cleanup) cleanup()

        return callWithAsyncErrorHandling(source, 'watch callback', [onCleanup])
      }
    }
  } else {
    getter = NOOP
  }

  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let cleanup: () => void
  let onCleanup: OnCleanup = (fn: () => void) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, 'watch cleanup')
    }
  }

  let oldValue: any = isMultiSource
    ? new Array((source as []).length).fill(INITIAL_WATCHER_VALUE)
    : INITIAL_WATCHER_VALUE
  const job: SchedulerJob = () => {
    if (!effect.active) return

    if (cb) {
      // watch(source, cb)
      const newValue = effect.run()
      if (
        deep ||
        forceTrigger ||
        (isMultiSource
          ? (newValue as any[]).some((v, i) =>
              hasChanged(v, (oldValue as any[])[i])
            )
          : hasChanged(newValue, oldValue))
      ) {
        // cleanup before running cb again
        if (cleanup) cleanup()

        callWithAsyncErrorHandling(cb, 'watch value', [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
          onCleanup
        ])
        oldValue = newValue
      }
    } else {
      // watchEffect
      effect.run()
    }
  }

  // important: mark the job as a watcher callback so that scheduler knows
  // it is allowed to self-trigger (#1727)
  job.allowRecurse = !!cb
  let scheduler: EffectScheduler
  if (flush === 'sync') {
    scheduler = job as any // the scheduler function gets called directly
  } else {
    // default: 'pre'
    // scheduler = () => {
    //   job()
    // }
    scheduler = () => queueJob(job)
  }

  const effect = new ReactiveEffect(getter, scheduler)

  // initial run
  if (cb) {
    if (immediate) job()
    else oldValue = effect.run()
  } else {
    effect.run()
  }

  return () => effect.stop()
}

function traverse(value: unknown, seen: Set<unknown> = new Set()) {
  if (!isObject(value) || (value as any).__v_skip || seen.has(value))
    return value

  seen.add(value)
  if (isRef(value)) {
    traverse(value.value, seen)
  } else if (isArray(value)) {
    value.forEach((val) => traverse(val, seen))
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, seen)
    })
  } else if (isPlainObject(value)) {
    Object.values(value).forEach((val) => {
      traverse(val, seen)
    })
  }
  return value
}
