import React, { ComponentClass, FC, useEffect, useState } from 'react'
import { RenderProps } from './interface'

type Props = {
  fields: string[]
} & RenderProps

// eslint-disable-next-line import/no-anonymous-default-export
export default function <T = any>(renderProps: FC<T> | ComponentClass<T>) {
  return ({ context, fields, ...rest }: T & Props) => {
    const [, setState] = useState({})

    useEffect(() => {
      let unSubscribe!: Function | undefined
      if (fields?.length) {
        unSubscribe = context?.subscribe?.(fields, () => {
          setState({})
        })
      }
      return () => {
        unSubscribe?.()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields])
    return React.createElement(renderProps, rest as T)
  }
}
