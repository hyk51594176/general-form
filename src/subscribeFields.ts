/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react'
import { RenderProps, RcCom, OBJ, Noop } from './interface'
import { useDeepEqualEffect } from './useDeepEqualEffect'

type Props = {
  fields: string[]
} & RenderProps

export default function <T extends OBJ = OBJ>(Comp: RcCom<T>) {
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
    return React.createElement(Comp, props)
  }
}
