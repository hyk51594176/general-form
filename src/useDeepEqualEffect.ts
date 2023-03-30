import isEqual from 'lodash/isEqual'
import { useEffect, useLayoutEffect, useRef } from 'react'

type DeepIsEqualType<TDeps = React.DependencyList> = (
  newDeps: TDeps,
  oldDeps: TDeps
) => boolean
export function useDeepEqualEffect<TDeps = React.DependencyList>(
  effect: React.EffectCallback,
  deps: TDeps,
  depsEqual: DeepIsEqualType<TDeps> = isEqual
) {
  const oldDeps = useRef<TDeps | undefined>(undefined)
  if (
    oldDeps.current === undefined ||
    !depsEqual(deps, oldDeps.current as TDeps)
  ) {
    oldDeps.current = deps
  }

  useEffect(effect, [oldDeps.current])
}

export function useDeepEqualLayoutEffect<TDeps = React.DependencyList>(
  effect: React.EffectCallback,
  deps: TDeps,
  depsEqual: DeepIsEqualType<TDeps> = isEqual
) {
  const oldDeps = useRef<TDeps | undefined>(undefined)
  if (
    oldDeps.current === undefined ||
    !depsEqual(deps, oldDeps.current as TDeps)
  ) {
    oldDeps.current = deps
  }

  useLayoutEffect(effect, [oldDeps.current])
}
