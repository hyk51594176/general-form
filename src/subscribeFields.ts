import React, { useState } from 'react'
import { RenderProps, RcCom, Obj } from './interface'
import { useDeepEqualEffect } from './useDeepEqualEffect'

type Props = {
  fields: string[]
} & RenderProps

// eslint-disable-next-line import/no-anonymous-default-export
export default function <T extends Obj = Obj>(Comp: RcCom<T>) {
  return (props: T & Props) => {
    const [, setState] = useState({})
    useDeepEqualEffect(() => {
      let unSubscribe!: Function | undefined
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
