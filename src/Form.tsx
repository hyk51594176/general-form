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
  FormRef
} from './interface'
const Form = React.forwardRef<FormRef, PropsWithChildren<FormProps>>((props, ref) => {
  type Data = typeof props['defaultData']
  const { columns = [], onChange, className = '', children, notLayout, style } = props
  const itemInstances = useRef<FormItemInstances>({})
  const eventList = useRef<Array<EventItem<Data>>>([])
  const subscribe = (fields: string[], callback: EventItem<Data>['callback']) => {
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
  const setValues = useCallback(
    (data: Data = {}) => {
      Object.entries(itemInstances.current).forEach(([field, item]) => {
        const value = get(data, field)
        item.setValue(value)
        bootstrap(field, value)
      })
    },
    [bootstrap]
  )
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
        comp.setValue(getValue(field))
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
      item.setValue(value)
      bootstrap(field, value)
    }
  }

  const validate = (params?: string[]): Promise<Data> => {
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
  const resetFields = (defaultData: Data = props.defaultData) => {
    setValues(defaultData)
    clearValidate()
  }
  const onFiledChange = (field: string, options: any) => {
    if (onChange) {
      onChange({
        field,
        value: options.value,
        e: options.e,
        formData: getValues()
      })
    }
    bootstrap(field, options.value)
  }

  const getFields = (fields?: string[]): string[] => {
    return fields || Object.keys(itemInstances.current)
  }
  useImperativeHandle(ref, () => ({
    subscribe,
    setValues,
    getValue,
    getValues,
    setValue,
    clearValidate,
    validate,
    resetFields
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
