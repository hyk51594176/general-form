import React, {
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef
} from 'react'
import Context from './Context'
import FormItem from './FormItem'
import './index.css'
import { FormProps, FormRef } from './interface'
import Store from './Store'
import { useDeepEqualEffect } from './useDeepEqualEffect'

const Form = React.forwardRef<FormRef, PropsWithChildren<FormProps>>(
  (props, ref) => {
    const {
      columns = [],
      style,
      defaultData,
      className,
      children,
      form,
      ...rest
    } = props
    const store = useRef(form ?? new Store(defaultData))
    useImperativeHandle(ref, () => store.current)
    useDeepEqualEffect(() => {
      if (defaultData !== undefined) {
        store.current.setValues(defaultData)
      }
    }, [defaultData])
    useEffect(() => () => store.current.destroy(), [])
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
    } = rest
    useLayoutEffect(() => {
      store.current.setOptions(rest)
    }, [rest])

    const value = useMemo(() => {
      return {
        ...store.current,
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
    }, [
      disabled,
      labelAlign,
      labelWidth,
      lg,
      md,
      minItemWidth,
      offset,
      size,
      sm,
      span
    ])
    return (
      <Context.Provider value={value}>
        <div className={`hyk-form  ${className ?? ''}`} style={style}>
          {columns.map((obj, index) => (
            <FormItem key={obj.field || String(index)} {...obj} />
          ))}
          {children}
        </div>
      </Context.Provider>
    )
  }
)

export default Form
