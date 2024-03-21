import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react'
import Schema from 'async-validator'
import get from 'lodash/get'
import set from 'lodash/set'
import eq from 'lodash/eq'

import cloneDeep from 'lodash/cloneDeep'
import { getContextWithProps } from './utils'
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
  const subscribe: ContextProp['subscribe'] = (fields, callback) => {
    const obj = { fields, callback }
    eventList.current.push(obj)
    return () => {
      eventList.current = eventList.current.filter((item) => item !== obj)
    }
  }
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
        if (!eq(value, oldVal)) {
          bootstrap(field, { value, oldVal })
          item.setValue(value)
        }
      })
    },
    [bootstrap]
  )
  const getValue = (field: string) => get(formData.current, field)

  const clearValidate = useCallback((params?: string[]) => {
    const fields = getFields(params)
    fields.forEach((field) => {
      const obj = itemInstances.current[field]
      if (obj && obj.errorMsg) {
        obj.setErrorMsg()
      }
    })
  }, [])
  const onLifeCycle = useCallback(
    (type: UpdateType, field: string, comp: FormItemInstance) => {
      if (type === UpdateType.mount) {
        if (itemInstances.current[field]) {
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
    [clearValidate]
  )
  const setValue = (field: string, value: any, isValidate?: boolean) => {
    if (typeof value === 'object') {
      const data = cloneDeep(formData.current)
      set(data, field, value)
      setValues(data)
      if (isValidate) {
        validate([field])
      }
    } else {
      const oldVal = getValue(field)
      set(formData.current, field, value)
      const item = itemInstances.current[field]
      if (item) {
        item.setValue(value)
        if (isValidate) {
          validate([field])
        }
      }
      bootstrap(field, { value, oldVal })
    }
  }

  const validate: ContextProp['validate'] = (params?: string[]): Promise<any> => {
    const fields = getFields(params).filter((k) => {
      const obj = itemInstances.current[k]
      return obj && (submitShow ? obj.show : true)
    })
    let data = {}
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
  }
  const resetFields = (data = defaultData) => {
    setValues(data)
    clearValidate()
  }
  const onFiledChange = (field: string, options: any) => {
    if (eq(options.value, getValue(field))) {
      return
    }
    setValue(field, options.value, true)
    if (onChange) {
      onChange({
        field,
        value: options.value,
        e: options.e,
        formData
      })
    }
  }

  const getFields = (fields?: string[]): string[] => {
    return fields ?? Object.keys(itemInstances.current)
  }
  useImperativeHandle(ref, () => ({
    subscribe,
    setValues,
    getValue,
    getValues,
    setValue,
    clearValidate,
    validate,
    resetFields,
    onFiledChange,
    onLifeCycle,
    bootstrap
  }))
  useEffect(() => {
    setValues(defaultData)
  }, [defaultData, setValues])
  return (
    <Context.Provider
      value={{
        setValue,
        setValues,
        subscribe,
        onLifeCycle,
        bootstrap,
        getValue,
        getValues,
        validate,
        resetFields,
        clearValidate,
        onFiledChange,
        ...getContextWithProps(props)
      }}
    >
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
