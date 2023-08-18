import get from 'lodash/get'
import has from 'lodash/has'
import isEqual from 'lodash/isEqual'
import React, { ComponentType, useState } from 'react'
import { OBJ, RenderProps } from './interface'
import { useDeepEqualEffect } from './useDeepEqualEffect'

type ResData = Array<{ label: string; value: number }>

type Props<V> = {
  getList?: (params: OBJ) => Promise<ResData>
  params?: {
    [k: string]: string | number | boolean | undefined
  }
  changeClearable?: boolean
} & RenderProps<V>

// eslint-disable-next-line import/no-anonymous-default-export
export default function <T extends OBJ, V = any>(
  Component: ComponentType<T>,
  k: keyof T = 'options',
  clearable = true
) {
  return ({
    context,
    params,
    getList,
    changeClearable = clearable,
    ...rest
  }: Props<V> & T) => {
    const [options, setDataSource] = useState<ResData>([])
    const [loading, setLoading] = useState<boolean>(false)
    const getData = () => {
      if (!context?.show) return
      const data = context?.getValues?.()
      const _params = Object.entries(params || {}).reduce(
        (item, [key, value]) => {
          return {
            ...item,
            [key]:
              typeof value === 'string' && has(data, value)
                ? get(data, value)
                : value
          }
        },
        {} as OBJ
      )
      if (getList) {
        setLoading(true)
      }
      getList?.(_params)
        .then((res = []) => {
          setDataSource(res)
          if (!context?.show) return
          const value = context?.getValue?.(context?.field as string)
          if (value && changeClearable) {
            const isArray = Array.isArray(value)
            const arr = isArray ? value : [value]
            const list: any[] = []
            if (!res.length) {
              rest?.onChange?.(isArray ? list : list[0])
            }
            const flag = arr.every((val: any) =>
              res.some(function dep(obj: any) {
                if (isEqual(obj.value, val)) {
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
        .catch(() => {
          setDataSource([])
        })
        .finally(() => {
          setLoading(false)
        })
    }

    useDeepEqualEffect(() => {
      const list = Object.values(params || {}) as string[]
      if (list.length) {
        return context?.subscribe?.(list, getData)
      }
      getData()
    }, [params, context?.show])

    const data = {
      context,
      loading,
      getData,
      ...rest,
      [k]: rest[k as keyof typeof rest] ?? options
    } as T
    return <Component {...data} />
  }
}
