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
  labelAlign?: CSSProperties['textAlign']
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
  columns?: Array<Column<any>>
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
  getValues: () => any
  setValue: (field: string, value: any) => void
  clearValidate: (field: string[]) => void
  setValues: (data: Partial<FormProps['defaultData']>) => void
  validate: (params?: string[]) => Promise<T>
  resetFields: (data?: Partial<T>) => void
}
export type Context<T = {} | undefined> = Omit<
  FormProps<T>,
  'columns' | 'className' | 'onChange' | 'notLayout' | 'style'
> &
  FormRef<T> & {
    onFiledChange: (field: string, options: any) => void
    onLifeCycle: (type: UpdateType, field: string, comp: FormItemInstance) => void
  }
export type RenderProps = {
  value: any
  show: boolean
  field: string
  onChange: (val: any, ...args: any[]) => void
} & Pick<Context, keyof FormRef>

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
export type FormItemProps = Common & {
  el?: string | ReactNode | RenderFn
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
type Column<T extends FC<any> | ComponentClass<any>> = FormItemProps & ComponentProps<T>
export const defineColumns = <T extends Comp, K extends keyof T = keyof T>(
  columns: Array<Column<T[K]>>
) => columns
