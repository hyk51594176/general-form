/* eslint-disable @typescript-eslint/no-explicit-any */
import { RuleItem } from 'async-validator'
import {
  ComponentClass,
  ComponentProps,
  ComponentType,
  CSSProperties,
  FC,
  ReactNode
} from 'react'
import Store from './Store'

export type Noop = () => void
export type OBJ = Record<string, any>

type Layout = {
  span?: string | number
  offset?: string | number
}
export interface Comp {
  [key: string]: any
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
export type FormProps<T extends OBJ = any, C extends Comp = Comp> = {
  columns?: Array<FormItemProps<C>>
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
  value: { value: V; oldVal: V; row: D }
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
  setValue(v: any): void
  setErrorMsg(msg?: string): void
}
export interface FormItemInstances {
  [key: string]: FormItemInstance
}
export interface FormRef<T = OBJ> {
  formData?: T
  subscribe: <J>(fields: string[], callback: SubCallback<J, T>) => () => void
  getValue: (field: string) => any
  getValues: () => T
  setValue: (field: string, value: any, validate?: boolean) => void
  clearValidate: (fields?: string[]) => void
  setValues: (data: Partial<T>) => void
  validate: (fields?: string[]) => Promise<T>
  resetFields: (data?: Partial<T>) => void
  resetField: (field: string, value?: any) => void
  onFiledChange: (field: string, options: any) => void
  bootstrap: (field: string, options: any) => void
  onLifeCycle: (type: UpdateType, field: string, comp: FormItemInstance) => void
}

export type ContextProp<T = OBJ> = Common & FormRef<T>
export type Rpor<FormData> = ContextProp<FormData> & {
  show?: boolean
  errorMsg?: string
}
export type RenderProps<T extends OBJ = OBJ, V = any, FormData = unknown> = {
  size?: string
  disabled?: boolean
  value?: V
  onChange?: (...e: any[]) => void
  context?: Rpor<FormData>
} & T

interface RenderFn {
  (props: RenderProps): ReactNode
}
export type ContextKey = keyof RenderProps
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
  T extends Comp = Comp,
  K extends keyof T = keyof T
> = Common & {
  el?: K | ReactNode | ComponentType
  field?: string
  label?: React.ReactNode
  content?: React.ReactNode
  itemClassName?: string
  required?: boolean
  rules?: Rule | Rule[]
  errorMsg?: string
  children?: ReactNode | RenderFn
  doNotRegister?: boolean
  onChange?: (value: any, ...args: any[]) => void
  itemStyle?: CSSProperties
  isShow?: boolean | DynamicParameter | undefined
} & ComponentProps<T[K]>
export type RcCom<T> = React.FunctionComponent<T> | React.ComponentClass<T, any>

export const defineColumns = <T extends Comp>(
  columns: Array<FormItemProps<T>>
) => columns
export const defineComponent = <T extends OBJ = OBJ, V = unknown, D = unknown>(
  fn: FC<RenderProps<T, D, V>> | ComponentClass<RenderProps<T, D, V>>
) => fn
