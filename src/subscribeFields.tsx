/* eslint-disable react/destructuring-assignment */
import React, { ComponentType } from 'react'
import { RenderProps } from './interface'
import { useWatch } from './hooks'

type Props = {
  fields: string[]
} & RenderProps

export default function <T>(Comp: ComponentType<T>) {
  return (props: T & Props) => {
    useWatch(props.fields, undefined, undefined, { deep: true })
    return <Comp {...props} />
  }
}
