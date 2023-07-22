/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RuleItem } from 'async-validator'
import {
  ComponentType,
  CSSProperties,
  JSXElementConstructor,
  ReactNode
} from 'react'
import Store from './Store'

export type Noop = () => void
export type OBJ = Record<string, any>
type ComponentProps<T> = T extends JSXElementConstructor<infer P>
  ? P
  : T extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[T]
  : {}
type Layout = {
  span?: string | number
  offset?: string | number
}
export interface Comp {
  [key: string]: keyof JSX.IntrinsicElements | JSXElementConstructor<any>
}
export type EventArg<DefaultData> = {
  field: string
  value: any
  e: any
  formData?: DefaultData
}
export type Common = {
  size?: string
  span?: number
  offset?: number
  labelAlign?: 'left' | 'right' | 'top'
  labelWidth?: CSSProperties['width']
  minItemWidth?: CSSProperties['minWidth']
  xs?: string | number | Layout
  sm?: string | number | Layout
  md?: string | number | Layout
  lg?: string | number | Layout
  xl?: string | number | Layout
  disabled?: boolean
  field?: string
}

export type FormProps<T extends Object = {}, C extends Comp = Comp> = {
  columns?: Array<FormItemProps<ComponentProps<C[keyof C]>, T>>
  className?: string
  defaultData?: Partial<T>
  notLayout?: boolean
  style?: CSSProperties
  submitShow?: boolean
  onChange?(arg: EventArg<T>): void
  form?: Store<T>
} & Common

export enum UpdateType {
  unmount,
  mount
}
export type SubCallback<V = any, D = any> = (
  field: string,
  value: {
    value: V
    oldVal: V
    row: D
    newValueList: any[]
    oldValueList: any[]
  }
) => void
export interface EventItem {
  fields: string[]
  callback: SubCallback
}
export interface ValidateParams {
  rule: {
    [k: string]: RuleItem | RuleItem[]
  }
  source: {
    [k: string]: any
  }
}
export interface FormItemInstance {
  errorMsg?: string
  rules?: RuleItem | RuleItem[]
  value?: any
  show?: boolean
  setErrorMsg(msg?: string): void
}
export interface FormItemInstances {
  [key: string]: Array<FormItemInstance>
}
export type FormRef<T extends Object = {}> = Omit<
  Store<T>,
  'setOptions' | 'destroy'
>

export type ContextProp<T extends OBJ = OBJ> = Common & FormRef<T>
export type Rpor<FormData extends OBJ> = ContextProp<FormData> & {
  show?: boolean
  errorMsg?: string
}
export type RenderProps<V = any, FormData extends OBJ = OBJ> = {
  size?: string
  disabled?: boolean
  value?: V
  field?: string
  onChange?: (...e: any[]) => void
  context?: Rpor<FormData>
}

export type DynamicParameter = {
  relation?: 'and' | 'or'
  notIn?: boolean
  relyOn: {
    [k: string]: any[] | ((value: any, context: Rpor<any>) => boolean)
  }
  external?: boolean
}
export interface Rule extends RuleItem {
  trigger?: string
}

export type FormItemProps<
  CP = {},
  FormData extends Object = {},
  EL = unknown
> = Common & {
  el?: EL | ReactNode | ComponentType<CP>
  field?: string
  label?: React.ReactNode
  content?: React.ReactNode
  itemClassName?: string
  required?: boolean
  rules?: Rule | Rule[]
  errorMsg?: string
  children?: ReactNode
  doNotRegister?: boolean
  onChange?: (value: any, ...args: any[]) => void
  itemStyle?: CSSProperties
  isShow?: boolean | DynamicParameter | undefined
  value?: any
  defaultValue?: any
  context?: Partial<FormRef<FormData>>
  [k: string]: any
} & CP
export type RcCom<T> = ComponentType<T>

export const defineColumns = <T, FormData extends Object = {}>(
  columns: Array<FormItemProps<ComponentProps<T[keyof T]>, FormData, keyof T>>
) => columns
export const defineComponent = <T, V = any, D extends OBJ = OBJ>(
  fn: ComponentType<RenderProps<V, D> & T>
) => fn
