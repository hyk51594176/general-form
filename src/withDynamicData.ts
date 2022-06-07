import isEqual from 'lodash/isEqual';
import get from 'lodash/get'
import has from 'lodash/has'
import React, { JSXElementConstructor, useEffect, useRef, useState } from 'react'
import { RenderProps } from './interface'
type ResData = Array<{ label: string; value: number }>

type Props<V> = {
  getList: (params: any) => Promise<ResData>
  params?: {
    [k: string]: string | number | boolean | undefined
  }
} & RenderProps<any,V>
// eslint-disable-next-line import/no-anonymous-default-export
export default function <T = any,V=any>(renderProps: JSXElementConstructor<T>, k?: keyof T) {
  return ({ context, params, getList, ...rest }: T & Props<V>) => {
    const [options, setDataSource] = useState<ResData>([])
    const getData = () => {
      const data = context?.getValues?.()
      const _params = Object.entries(params || {}).reduce((item, [key, value]) => {
        return {
          ...item,
          [key]: typeof value === 'string' && has(data, value) ? get(data, value) : value
        }
      }, {} as any)
      getList?.(_params).then((res = []) => {
        setDataSource(res)
        if (rest.value) {
          const isArray = Array.isArray(rest.value)
          let arr = isArray ? rest.value : [rest.value]
          let list: any[] = []
          if(!res.length){
            rest?.onChange?.(isArray ? list : list[0])
          }
          const flag = arr.every((val: any) =>
            res.some(function dep(obj: any) {
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
      })
    }
    const oldParams = useRef<Props<V>['params']>({})

    useEffect(() => {
      if (!isEqual(params, oldParams.current)) {
        oldParams.current = params
        getData()
      }
    }, [params])

    useEffect(() => {
      const list = Object.values(params || {}) as string[]
      let unSubscribe!: Function | undefined
      if (list.length && context?.field) {
        unSubscribe = context?.subscribe?.(list, getData)
      }
      return () => {
        unSubscribe?.()
      }
    }, [context, params])

    const data = { [k ?? 'options']: options, ...rest } as T
    return React.createElement(renderProps, data)
  }
}
