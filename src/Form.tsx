import React, {
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react'
import Context from './Context'
import FormItem from './FormItem'
import './index.css'
import { FormProps, FormRef } from './interface'
import { useDeepEqualLayoutEffect } from './useDeepEqualEffect'
import Store from './Store'

const Form = React.forwardRef<FormRef, PropsWithChildren<FormProps>>(
  (props, ref) => {
    const {
      columns = [],
      notLayout,
      style,
      defaultData,
      className,
      children,
      form,
      ...rest
    } = props
    const store = useRef(form ?? new Store(defaultData))
    const getRefFn = useCallback(() => store.current, [])
    useImperativeHandle(ref, getRefFn)
    useDeepEqualLayoutEffect(() => {
      if (defaultData !== undefined) {
        store.current.setValues(defaultData)
      }
    }, [defaultData])
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
    useDeepEqualLayoutEffect(() => {
      store.current.setOptions(rest)
    }, [rest])

    const value = useMemo(() => {
      return {
        ...getRefFn(),
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
      getRefFn,
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
        <div
          className={`hyk-form ${
            notLayout ? 'hyk-form-table' : ''
          } ${className}`}
          style={style}
        >
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
