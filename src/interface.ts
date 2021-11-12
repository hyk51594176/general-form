/* eslint-disable @typescript-eslint/indent */
/*
 * @Author: 韩玉凯
 * @Date: 2020-07-24 23:16:48
 * @LastEditors: 韩玉凯
 * @LastEditTime: 2021-01-25 19:08:34
 * @FilePath: /general-form/src/interface.ts
 */
import { RuleItem } from 'async-validator'
import { CSSProperties } from 'react'
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

export interface RenderProps extends DefaultItemProps {
  value: any
  show: boolean
  onChange: (val: any, ...args: any[]) => void
}
interface RenderFn {
  (props: RenderProps): JSX.Element
}
interface DynamicParameter {
  relation?: 'and' | 'or'
  notIn?: true
  relyOn: {
    [k: string]: Array<string | number | boolean | null | undefined>
  }
}
export interface FormItemProps extends Context {
  value?: any
  defaultValue?: any
  el?: string | JSX.Element | RenderFn
  field?: string
  label?: string | JSX.Element | RenderFn
  itemClassName?: string
  required?: boolean
  rules?: Rule | Rule[]
  errorMsg?: string
  children?: React.ReactNode
  onChange?: (value: any, ...args: any[]) => void
  itemStyle?: CSSProperties
  isShow?: boolean | DynamicParameter
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

export interface Column extends ExcludeProps<FormItemProps> {
  [key: string]: any
}

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
