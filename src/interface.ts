/* eslint-disable @typescript-eslint/indent */
/*
 * @Author: 韩玉凯
 * @Date: 2020-07-24 23:16:48
 * @LastEditors: 韩玉凯
 * @LastEditTime: 2021-01-25 19:08:34
 * @FilePath: /general-form/src/interface.ts
 */
import { RuleItem } from 'async-validator'
import { CSSProperties, ReactNode, FC, ComponentClass } from 'react'
import { Form } from './Form'
import FormItem from './FormItem'

export interface DefaultItemProps {
  onFiledChange: Form['onFiledChange']
  onLifeCycle: Form['onLifeCycle']
  subscribe: Form['subscribe']
  getValue: Form['getValue']
  getValues: Form['getValues']
  setValue: Form['setValue']
  setValues: Form['setValues']
  validate: Form['validate']
}

export interface Context extends DefaultItemProps {
  size?: string
  span?: string | number
  offset?: string | number
  labelWidth?: CSSProperties['width']
  minItemWidth?: CSSProperties['minWidth']
  labelAlign?: CSSProperties['textAlign']
  xs?: string | number | Layout
  sm?: string | number | Layout
  md?: string | number | Layout
  lg?: string | number | Layout
  xl?: string | number | Layout
  disabled?: boolean
}

export type ExcludeProps<P> = Omit<
  P,
  | 'onFiledChange'
  | 'onLifeCycle'
  | 'subscribe'
  | 'getValue'
  | 'getValues'
  | 'setValue'
  | 'setValues'
  | 'validate'
  | 'onChange'
  | 'value'
  | 'show'
>
export interface Rule extends RuleItem {
  trigger?: string
}
export enum UpdateType {
  unmount,
  mount
}
export interface ValidateParam {
  rules?: RuleItem | RuleItem[]
  value: any
}
interface Layout {
  span?: string | number
  offset?: string | number
}
export interface Comp {
  [key: string]: FC<any> | ComponentClass<any>
}
export interface RenderProps extends DefaultItemProps {
  value: any
  show: boolean
  field: string
  onChange: (val: any, ...args: any[]) => void
}
interface RenderFn {
  (props: RenderProps): ReactNode
}
interface DynamicParameter {
  relation?: 'and' | 'or'
  notIn?: boolean
  relyOn: {
    [k: string]: any[] | undefined
  }
}
// type FirstType<U> = U extends (k: infer I, ...args: any[]) => any ? I : never

// type WithoutNever<T> = Pick<
//   T,
//   { [k in keyof T]: T[k] extends never ? never : k }[keyof T]
// >
// type GetType<U> = WithoutNever<FirstType<U>>

export interface FormItemProps extends Context {
  [key: string]: any
  value?: any
  defaultValue?: any
  el?: string | ReactNode | RenderFn
  field?: string
  label?: string | ReactNode | RenderFn
  itemClassName?: string
  required?: boolean
  rules?: Rule | Rule[]
  errorMsg?: string
  children?: ReactNode | RenderFn
  onChange?: (value: any, ...args: any[]) => void
  itemStyle?: CSSProperties
  isShow?: boolean | DynamicParameter | undefined
  whitContext?: boolean
  // props?: GetType<T[K]>
}

export interface EventArg<DefaultData> {
  field: string
  value: any
  e: any
  formData: DefaultData
}
export interface EventItem<DefaultData> {
  fields: string[]
  callback(field: string, value: any, data: DefaultData): void
}

export type Column = ExcludeProps<FormItemProps>
export const defineColumns = (columns: Column[]) => columns
export interface FormProps<DefaultData> {
  columns?: Column[]
  className?: string
  isArray?: boolean // defaultData 数据结构是否为数组
  size?: string
  span?: number
  offset?: number
  style?: CSSProperties
  labelAlign?: CSSProperties['textAlign']
  labelWidth?: CSSProperties['width']
  minItemWidth?: CSSProperties['minWidth']
  defaultData?: DefaultData
  isNullClear?: boolean // 当formitem unmount的时候是否清除当前字段
  notLayout?: boolean
  xs?: string | number | Layout
  sm?: string | number | Layout
  md?: string | number | Layout
  lg?: string | number | Layout
  xl?: string | number | Layout
  disabled?: boolean
  onChange?(arg: EventArg<DefaultData>): void
}
export interface ValidateParams {
  rule: {
    [k: string]: RuleItem | RuleItem[]
  }
  source: {
    [k: string]: any
  }
}

export interface ItemInstance {
  [key: string]: FormItem
}
