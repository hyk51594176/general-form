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
import has from 'lodash/has'
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
  const { columns = [], onChange, className = '', children, notLayout, style } = props
  const itemInstances = useRef<FormItemInstances>({})
  const eventList = useRef<Array<EventItem>>([])
  const subscribe: ContextProp['subscribe'] = (fields, callback) => {
    const obj = { fields, callback }
    eventList.current.push(obj)
    return () => {
      eventList.current = eventList.current.filter((item) => item !== obj)
    }
  }
  const getValues = useCallback(() => {
    return Object.entries(itemInstances.current)
      .filter(([_, item]) => item.show)
      .reduce(
        (obj, [k, item]) => {
          set(obj, k, item.value)
          return obj
        },
        Array.isArray(props.defaultData) ? [] : {}
      )
  }, [props.defaultData])
  const bootstrap = useCallback(
    (field: string, value: any) => {
      eventList.current.forEach((obj, index) => {
        if (obj.fields.includes(field)) {
          if (obj.callback) obj.callback(field, value, getValues())
          else eventList.current.splice(index, 1)
        }
      })
    },
    [getValues]
  )
  const setValues = useCallback((data = {}) => {
    data = cloneDeep(data)
    Object.entries(itemInstances.current).forEach(([field, item]) => {
      const value = get(data, field)
      item.setValue(value)
    })
  }, [])
  const getValue = (field: string) => {
    const item = itemInstances.current[field]
    if (item && item.show) return item.value
    return undefined
  }

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
      } else if (type === UpdateType.unmount) {
        clearValidate([field])
        delete itemInstances.current[field]
      }
    },
    [clearValidate]
  )
  const setValue = (field: string, value: any) => {
    const item = itemInstances.current[field]
    if (item) {
      if (typeof value === 'object') {
        Object.keys(itemInstances.current)
          .filter((key) => key.startsWith(field) && key !== field)
          .forEach((key) => {
            const k = key.replace(field, '')
            if (has(value, k)) {
              setValue(key, get(value, k))
            }
          })
      }
      item.setValue(value)
    }
  }

  const validate: ContextProp['validate'] = (params?: string[]): Promise<any> => {
    const fields = getFields(params)
    const data = getValues()
    if (!fields.length) return Promise.resolve(data)
    const validateParams: ValidateParams = fields.reduce(
      ({ rule, source }: ValidateParams, field) => {
        const obj = itemInstances.current[field]
        if (obj && obj.rules && obj.show) {
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
        return Promise.resolve(data)
      })
      .catch((err) => {
        const { errors = [] } = err
        errors.forEach((obj: any) => {
          itemInstances.current[obj.field].setErrorMsg(obj.message)
        })
        return Promise.reject(err)
      })
  }
  const resetFields = (defaultData = props.defaultData) => {
    setValues(defaultData)
    clearValidate()
  }
  const onFiledChange = (field: string, options: any) => {
    const formData = getValues()
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
    setValues(props.defaultData || {})
  }, [props.defaultData, setValues])
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
