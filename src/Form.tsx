import React, { PropsWithChildren, useCallback, useImperativeHandle, useMemo, useRef } from 'react'
import Schema from 'async-validator'
import get from 'lodash/get'
import set from 'lodash/set'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import Context from './Context'
import FormItem from './FormItem'
import './index.scss'
import {
  FormProps,
  EventItem,
  FormItemInstance,
  FormItemInstances,
  ValidateParams,
  UpdateType,
  FormRef,
  ContextProp
} from './interface'
import { useDeepEqualEffect } from './useDeepEqualEffect'
const Form = React.forwardRef<FormRef, PropsWithChildren<FormProps>>((props, ref) => {
  const {
    columns = [],
    onChange,
    className = '',
    children,
    notLayout,
    style,
    defaultData,
    submitShow = true
  } = props
  const itemInstances = useRef<FormItemInstances>({})
  const eventList = useRef<Array<EventItem>>([])
  const formData = useRef<any>()
  const subscribe = useCallback<ContextProp['subscribe']>((fields, callback) => {
    const obj = { fields, callback }
    eventList.current.push(obj)
    return () => {
      eventList.current = eventList.current.filter((item) => item !== obj)
    }
  },[])
  const getValue = useCallback((field: string) => get(formData.current, field), [])
  const getFields = useCallback((fields?: string[]): string[] => {
    return fields ?? Object.keys(itemInstances.current)
  }, [])
  const clearValidate = useCallback((params?: string[]) => {
    const fields = getFields(params)
    fields.forEach((field) => {
      const obj = itemInstances.current[field]
      if (obj && obj.errorMsg) {
        obj.setErrorMsg()
      }
    })
  }, [getFields])
  const getValues = useCallback(() => formData.current, [])
  const bootstrap = useCallback((field: string, value: any) => {
    eventList.current.forEach((obj, index) => {
      if (obj.fields.includes(field)) {
        if (obj.callback) obj.callback(field, value)
        else eventList.current.splice(index, 1)
      }
    })
  }, [])
  
  const setValues = useCallback(
    (data = {}) => {
      formData.current = cloneDeep(data)
      Object.entries(itemInstances.current).forEach(([field, item]) => {
        const value = getValue(field)
        const oldVal = item.value
        if (!isEqual(value, oldVal)) {
          item.setValue(value)
          setTimeout(() => {
            bootstrap(field, { value, oldVal, row: getValues() })
          }, 0)
        }
      })
    },
    [bootstrap, getValue, getValues]
  )
  const validate = useCallback<ContextProp['validate']>(
    (params) => {
      const fields = getFields(params).filter((k) => {
        const obj = itemInstances.current[k]
        return obj && (submitShow ? obj.show : true)
      })
      let data = Array.isArray(formData.current) ? [] : {}
      fields.forEach((k) => {
        set(data, k, getValue(k))
      })
      if (!fields.length) return Promise.resolve(data)
      const validateParams: ValidateParams = fields.reduce(
        ({ rule, source }: ValidateParams, field) => {
          const obj = itemInstances.current[field]
          if (obj && obj.rules) {
            rule[field] = obj.rules
            source[field] = obj.value
          }
          return { rule, source }
        },
        { rule: {}, source: {} }
      )
      if (!Object.keys(validateParams.rule).length) {
        return Promise.resolve(data)
      }
      return new Schema(validateParams.rule)
        .validate(validateParams.source)
        .then(() => {
          clearValidate(fields)
          return data
        })
        .catch((err) => {
          const { errors = [] } = err
          errors.forEach((obj: any) => {
            itemInstances.current[obj.field].setErrorMsg(obj.message)
          })
          return Promise.reject(err)
        })
    },
    [clearValidate, getFields, getValue, submitShow]
  )
  const setValue = useCallback(
    (field: string, value: any) => {
      const oldVal = cloneDeep(getValue(field))
      set(formData.current, field, value)
      setValues(formData.current)
      if (!itemInstances.current[field]) {
        bootstrap(field, { value, oldVal, row: getValues() })
      } else {
        validate([field])
      }
    },
    [bootstrap, getValue, getValues, setValues, validate]
  )

  const onLifeCycle = useCallback(
    (type: UpdateType, field: string, comp: FormItemInstance) => {
      if (type === UpdateType.mount) {
        if (itemInstances.current[field] && itemInstances.current[field].show) {
          if (itemInstances.current[field] !== comp) {
            console.error(`重复的field字段定义: ${field}`)
          }
        }
        itemInstances.current[field] = comp
        comp.setValue(getValue(field))
      } else if (type === UpdateType.unmount) {
        clearValidate([field])
        delete itemInstances.current[field]
      }
    },
    [clearValidate, getValue]
  )

  
  const resetFields = useCallback(
    (data = defaultData) => {
      setValues(data)
      clearValidate()
    },
    [clearValidate, defaultData, setValues]
  )
  const resetField = useCallback(
    (field: string, value: any = get(defaultData, field)) => {
      setValue(field, value)
    },
    [defaultData, setValue]
  )
  const onFiledChange = useCallback(
    (field: string, options: any) => {
      setValue(field, options.value)
      if (onChange) {
        onChange({
          field,
          value: options.value,
          e: options.e,
          formData: formData.current
        })
      }
    },
    [onChange, setValue]
  )

  const getRefFn = useCallback(
    () => ({
      subscribe,
      setValues,
      getValue,
      getValues,
      setValue,
      clearValidate,
      validate,
      resetFields,
      resetField,
      onFiledChange,
      onLifeCycle,
      bootstrap
    }),
    []
  )
  useImperativeHandle(ref, getRefFn)
  useDeepEqualEffect(() => {
    setValues(defaultData)
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
  } = props
  const store = useMemo(() => {
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
  }, [disabled, getRefFn, labelAlign, labelWidth, lg, md, minItemWidth, offset, size, sm, span])
  return (
    <Context.Provider value={store}>
      <div className={`hyk-form ${notLayout ? 'hyk-form-table' : ''} ${className}`} style={style}>
        {columns.map((obj, index) => (
          <FormItem key={obj.field || String(index)} {...obj} />
        ))}
        {children}
      </div>
    </Context.Provider>
  )
})

export default Form
