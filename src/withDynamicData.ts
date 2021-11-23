import get from 'lodash/get'
import has from 'lodash/has'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { RenderProps } from './interface'
type ResData = Array<{ label: string; value: number }>

type Props = {
  getList: (params: any) => Promise<ResData>
  params?: {
    [k: string]: string | number | boolean | undefined
  }
  onChange?: any
}
type RenderFn<T = any> = (props: T) => ReactElement<T>
// eslint-disable-next-line import/no-anonymous-default-export
export default function <T = any>(renderProps: RenderFn<T>) {
  return ({ context, params, getList, ...rest }: RenderProps<T> & Props) => {
    const [options, setDataSource] = useState<ResData>([])
    const getData = useCallback(
      (data: any = {}) => {
        const _params = Object.entries(params || {}).reduce((item, [key, value]) => {
          return {
            ...item,
            [key]: typeof value === 'string' && has(data, value) ? get(data, value) : value
          }
        }, {} as any)
        getList(_params).then((res) => {
          setDataSource(res)
        })
      },
      [getList, params]
    )
    useEffect(() => {
      getData(context?.getValues?.())
      const list = Object.values(params || {}) as string[]
      let unSubscribe!: Function | undefined
      if (list.length && context?.field) {
        unSubscribe = context?.subscribe?.(list, () => {
          ;(rest as any).onChange?.(undefined)
          getData(context?.getValues?.())
        })
      }
      return () => {
        unSubscribe?.()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [context?.field])
    const data = { options, ...rest } as unknown
    return renderProps(data as T)
  }
}
