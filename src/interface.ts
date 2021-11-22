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
}
export type FormProps<T = any> = {
  columns?: Array<Column>
  className?: string
  defaultData?: Partial<T>
  notLayout?: boolean
  style?: CSSProperties
  onChange?(arg: EventArg<T>): void
} & Common

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
export enum UpdateType {
  unmount,
  mount
}
export interface EventItem<D> {
  fields: string[]
  callback(field: string, value: any, data: D): void
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
export type FormRef<T = unknown> = {
  subscribe: (fields: string[], callback: EventItem<T>['callback']) => () => void
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
export type ContextProp<T = {} | undefined> = Omit<
  FormProps<T>,
  'columns' | 'className' | 'onChange' | 'notLayout' | 'style'
> &
  FormRef<T>
export type RenderProps<T = {}, FormData = unknown> = {
  value?: any
  show?: boolean
  field?: string
  onChange?: (val: any, ...args: any[]) => void
} & Partial<ContextProp<FormData>> &
  T

interface RenderFn {
  (props: RenderProps): ReactNode
}
type DynamicParameter = {
  relation?: 'and' | 'or'
  notIn?: boolean
  relyOn: {
    [k: string]: any[] | undefined
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
  whitContext?: boolean
}
export type Column<T extends Comp = Comp, K extends keyof T = keyof T> = FormItemProps<T> &
  ComponentProps<T[K]>
export const defineColumns = <T extends Comp>(columns: Array<Column<T>>) => columns
export const defineComponent = <T, D = unknown>(
  fn: FC<RenderProps<T, D>> | ComponentClass<RenderProps<T, D>>
) => fn
