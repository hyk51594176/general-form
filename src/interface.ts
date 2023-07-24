/* eslint-disable @typescript-eslint/indent */
import { RuleItem } from 'async-validator'
import { ComponentClass, ComponentProps, CSSProperties, FC, ReactNode } from 'react'

type Layout = {
  span?: string | number
  offset?: string | number
}
export interface Comp {
  [key: string]: FC<any> | ComponentClass<any>
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
export type FormProps<T = any, Components extends Comp = Comp> = {
  columns?: Array<Column<Components>>
  className?: string
  defaultData?: Partial<T>
  notLayout?: boolean
  style?: CSSProperties
  submitShow?: boolean
  onChange?(arg: EventArg<T>): void
} & Common

export enum UpdateType {
  unmount,
  mount
}
export interface EventItem {
  fields: string[]
  callback(field: string, value: any): void
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
export type FormRef<T extends Object = {}> = {
  subscribe: (fields: string[], callback: EventItem['callback']) => () => void
  getValue: (field: string) => any
  getValues: () => T
  setValue: (field: string, value: any) => void
  clearValidate: (field: string[]) => void
  setValues: (data: Partial<T>) => void
  validate: (params?: string[]) => Promise<T>
  resetFields: (data?: Partial<T>) => void
  onFiledChange: (field: string, options: any) => void
  bootstrap: (field: string, options: any) => void
  onLifeCycle: (type: UpdateType, field: string, comp: FormItemInstance) => void
}
export type ContextProp<T = {}> = Common & FormRef<T>
type Rpor<FormData> = ContextProp<FormData> & { show?: boolean }
export type RenderProps<T = {}, FormData = unknown> = {
  size?: string
  disabled?: boolean
  value?: any
  onChange?: (e: any) => void
  context?: Rpor<FormData>
} & T

interface RenderFn {
  (props: RenderProps): ReactNode
}
export type ContextKey = keyof RenderProps
type DynamicParameter = {
  relation?: 'and' | 'or'
  notIn?: boolean
  relyOn: {
    [k: string]: any[] | undefined| ((value: any,contextData:ContextProp) => boolean)
  }
}
export interface Rule extends RuleItem {
  trigger?: string
}
export type FormItemProps<T extends Comp = Comp> = Common & {
  [k: string]: any
  el?: keyof T | ReactNode | RenderFn
  field?: string
  label?: string | ReactNode | RenderFn
  content?: string | ReactNode | RenderFn
  itemClassName?: string
  required?: boolean
  rules?: Rule | Rule[]
  errorMsg?: string
  children?: ReactNode | RenderFn
  onChange?: (value: any, ...args: any[]) => void
  itemStyle?: CSSProperties
  isShow?: boolean | DynamicParameter | undefined
}
export type Column<T extends Comp = Comp, K extends keyof T = keyof T> = FormItemProps<T> &
  ComponentProps<T[K]>
export const defineColumns = <T extends Comp>(columns: Array<Column<T>>) => columns
export const defineComponent = <T, D = unknown>(
  fn: FC<RenderProps<T, D>> | ComponentClass<RenderProps<T, D>>
) => fn
