/* eslint-disable no-param-reassign */
import React from 'react'
import Schema from 'async-validator'
import Item from './FormItem'
import get from 'lodash/get'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import './index.scss'
import {
  FormProps,
  ItemInstance,
  EventItem,
  UpdateType,
  ValidateParams,
  Context
} from './interface'
import { withFormContext, ContextType } from './withFormContext'

export const FormItem = withFormContext(Item)

export class Form<
  DefaultData extends Record<string, any> = {}
> extends React.Component<FormProps<DefaultData>> {
  static defaultProps = {
    columns: [],
    labelAlign: 'right',
    labelWidth: '80px'
  }

  static childContextTypes = ContextType

  itemInstances: ItemInstance = {}

  formData!: DefaultData

  eventList: Array<EventItem<DefaultData>> = []

  constructor(props: FormProps<DefaultData>) {
    super(props)
    this.initFormData(this.props.defaultData)
  }

  getChildContext(): Context {
    const {
      size,
      span,
      offset,
      labelWidth,
      labelAlign,
      minItemWidth,
      xs,
      sm,
      md,
      lg,
      xl,
      disabled
    } = this.props
    const {
      getValue,
      getValues,
      setValue,
      setValues,
      onFiledChange,
      onLifeCycle,
      subscribe,
      validate
    } = this
    return {
      size,
      span,
      offset,
      labelWidth,
      minItemWidth,
      labelAlign,
      getValue,
      getValues,
      setValue,
      setValues,
      onFiledChange,
      onLifeCycle,
      subscribe,
      validate,
      disabled,
      xs,
      sm,
      md,
      lg,
      xl
    }
  }

  componentDidUpdate(preProps: FormProps<DefaultData>) {
    if (preProps.defaultData !== this.props.defaultData) {
      this.resetFields(this.props.defaultData)
    }
  }

  subscribe = (
    fields: string[],
    callback: EventItem<DefaultData>['callback']
  ) => {
    const obj = { fields, callback }
    this.eventList.push(obj)
    return () => {
      this.eventList = this.eventList.filter((item) => item !== obj)
    }
  }

  initFormData = (defaultData: DefaultData | undefined, isSet = false) => {
    this.formData = cloneDeep<DefaultData>(
      defaultData || ((this.props.isArray ? [] : {}) as any)
    )
    // JSON.parse(
    //   JSON.stringify(defaultData || (this.props.isArray ? [] : {})),
    // );
    if (isSet) {
      this.setValues(this.formData)
    }
  }

  onLifeCycle = (type: UpdateType, field: string, comp: Item) => {
    if (type === UpdateType.mount) {
      if (this.itemInstances[field]) {
        if (this.itemInstances[field] !== comp) {
          console.error(`重复的field字段定义: ${field}`)
        }
      }
      this.itemInstances[field] = comp
      comp.setValue(this.getValue(field))
    } else if (type === UpdateType.unmount) {
      delete this.itemInstances[field]
      if (this.props.isNullClear && get(this.formData, field) !== undefined) {
        set(this.formData, field, undefined)
      }
    }
  }

  onFiledChange = (field: string, options: any) => {
    set(this.formData, field, options.value)
    if (typeof this.props.onChange === 'function') {
      this.props.onChange({
        field,
        value: options.value,
        e: options.e,
        formData: this.formData
      })
    }
    this.eventList.forEach((obj, index) => {
      if (obj.fields.includes(field)) {
        if (obj.callback) obj.callback(field, options.value, this.formData)
        else this.eventList.splice(index, 1)
      }
    })
  }

  setValue = (field: string, value: any) => {
    set(this.formData, field, value)
    const item = this.itemInstances[field]
    if (item) {
      item.setValue(value, () => {
        this.validate([field])
      })
      this.eventList.forEach((obj, index) => {
        if (obj.fields.includes(field)) {
          if (obj.callback) obj.callback(field, value, this.formData)
          else this.eventList.splice(index, 1)
        }
      })
    }
  }

  getValue = (field: string) => {
    return get(this.formData, field)
  }

  getValues = () => {
    return this.formData
  }

  setValues = (values: any) => {
    this.formData = values
    Object.entries(this.itemInstances).forEach(([field, item]) => {
      const value = get(this.formData, field)
      item.setValue(value)
      this.eventList.forEach((obj, index) => {
        if (obj.fields.includes(field)) {
          if (obj.callback) obj.callback(field, value, this.formData)
          else this.eventList.splice(index, 1)
        }
      })
    })
  }

  resetFields = (
    defaultData: DefaultData | undefined = this.props.defaultData
  ) => {
    this.initFormData(defaultData, true)
    this.clearValidate()
  }

  clearValidate = (params?: string[]) => {
    const fields = this.getFields(params)
    fields.forEach((field) => {
      const obj = this.itemInstances[field]
      if (obj && obj.state.errorMsg) {
        obj.setErrorMsg()
      }
    })
  }

  getFields = (fields?: string[]): string[] => {
    return fields || Object.keys(this.itemInstances)
  }

  validate = (params?: string[]): Promise<DefaultData> => {
    const fields = this.getFields(params)
    if (!fields.length) return Promise.resolve(this.formData)
    const validateParams: ValidateParams = fields.reduce(
      ({ rule, source }: ValidateParams, field) => {
        const obj = this.itemInstances[field]
        if (obj && obj.props.rules) {
          rule[field] = obj.props.rules
          source[field] = obj.state.value
        }
        return { rule, source }
      },
      { rule: {}, source: {} }
    )
    if (!Object.keys(validateParams.rule).length) {
      return Promise.resolve(this.formData)
    }
    return new Schema(validateParams.rule)
      .validate(validateParams.source)
      .then(() => {
        this.clearValidate(fields)
        return Promise.resolve(this.formData)
      })
      .catch((err) => {
        const { errors = [] } = err
        errors.forEach((obj: any) => {
          this.itemInstances[obj.field].setErrorMsg(obj.message)
        })
        return Promise.reject(err)
      })
  }

  render() {
    const {
      columns = [],
      className = '',
      children,
      notLayout,
      style
    } = this.props
    return (
      <div
        className={`hyk-form ${notLayout ? 'hyk-form-table' : ''} ${className}`}
        style={style}
      >
        {columns.map((obj, index) => (
          <FormItem key={obj.field || String(index)} {...obj} />
        ))}
        {children}
      </div>
    )
  }
}
