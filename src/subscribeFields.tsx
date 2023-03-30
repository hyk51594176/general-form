/* eslint-disable react/destructuring-assignment */
import React, { ComponentType, useState } from 'react'
import { RenderProps, Noop } from './interface'
import { useDeepEqualEffect } from './useDeepEqualEffect'

type Props = {
  fields: string[]
} & RenderProps

export default function <T>(Comp: ComponentType<T>) {
  return (props: T & Props) => {
    const [, setState] = useState({})
    useDeepEqualEffect(() => {
      let unSubscribe!: Noop | undefined
      if (props.fields?.length) {
        unSubscribe = props.context?.subscribe?.(props.fields, () => {
          setState({})
        })
      }
      return () => {
        unSubscribe?.()
      }
    }, [props.fields])
    return <Comp {...props} />
  }
}
