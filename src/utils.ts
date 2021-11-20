import { FormProps, Comp } from './interface'
/*
 * @Author: 韩玉凯
 * @Date: 2020-07-04 23:01:47
 * @LastEditors: 韩玉凯
 * @LastEditTime: 2020-08-03 17:34:27
 * @FilePath: /mcommon/src/utils.ts
 */

export const components: Comp = {}

export const registerComponent = (obj: Comp) => {
  Object.assign(components, obj)
}
export const _toString = Object.prototype.toString
export const getType = (obj: unknown) => {
  return _toString.call(obj).slice(8, -1)
}

export const getContextWithProps = (data: FormProps) => {
  const {
    labelAlign = 'right',
    labelWidth = '80px',
    span,
    size,
    lg,
    md,
    sm,
    minItemWidth,
    disabled,
    offset
  } = data
  return {
    labelAlign,
    labelWidth,
    span,
    size,
    lg,
    md,
    sm,
    minItemWidth,
    disabled,
    offset
  }
}
