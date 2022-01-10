import get from 'lodash/get'
import has from 'lodash/has'
import React, { ReactElement, useEffect, useState } from 'react'
import { RenderProps } from './interface'
type ResData = Array<{ label: string; value: number }>

type Props = {
  getList: (params: any) => Promise<ResData>
  params?: {
    [k: string]: string | number | boolean | undefined
  }
  onChange?: any
} & RenderProps
type RenderFn<T = any> = (props: T) => ReactElement<T>

// eslint-disable-next-line import/no-anonymous-default-export
export default function <T = any>(renderProps: RenderFn<T>, k?: keyof T) {
  return ({ context, params, getList, ...rest }: T & Props) => {
    const [options, setDataSource] = useState<ResData>([])
    const getData = (data: any = {}) => {
      const _params = Object.entries(params || {}).reduce((item, [key, value]) => {
        return {
          ...item,
          [key]: typeof value === 'string' && has(data, value) ? get(data, value) : value
        }
      }, {} as any)
      getList?.(_params).then((res = []) => {
        setDataSource(res)
      })
    }
    useEffect(() => {
      if (rest.value && options.length) {
        const isArray = Array.isArray(rest.value)
        let arr = isArray ? rest.value : [rest.value]
        let list: any[] = []
        const flag = arr.every((val: any) =>
          options.some(function dep(obj: any) {
            if (obj.value === val) {
              list.push(val)
              return true
            }
            if (obj.children && obj.children.length) {
              return obj.children.some(dep)
            }
            return false
          })
        )
        if (!flag) {
          ;(rest as any)?.onChange(isArray ? list : list[0])
        }
      }
    }, [rest.value, options])

    useEffect(() => {
      getData(context?.getValues?.())
      const list = Object.values(params || {}) as string[]
      let unSubscribe!: Function | undefined
      if (list.length && context?.field) {
        unSubscribe = context?.subscribe?.(list, () => {
          getData(context?.getValues?.())
        })
      }
      return () => {
        unSubscribe?.()
      }
    }, [context?.field, params])
    const data = { [k ?? 'options']: options, ...rest } as T
    return React.createElement(renderProps, data)
  }
}
