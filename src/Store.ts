import Schema from 'async-validator'
import get from 'lodash/get'
import set from 'lodash/set'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import { Common, SubCallback, EventItem, FormItemInstances, ValidateParams, EventArg, UpdateType, FormItemInstance } from "./interface"
type Options<T> = { submitShow?: boolean, onChange?: (arg: EventArg<T>) => void }
export default class Store<T extends Object = {}> {
  options: Options<T> = {
    submitShow: true
  }
  formData!: T
  eventList: Array<EventItem> = []
  itemInstances: FormItemInstances = {}
  constructor(defaultData?: T) {
    this.setValues(defaultData)
  }
  setOptions(options: Options<T>) {
    Object.assign(this.options, options)
  }
  subscribe = <J>(fields: string[], callback: SubCallback<J, T>) => {
    const obj = { fields, callback }
    this.eventList.push(obj)
    return () => {
      this.eventList = this.eventList.filter((item) => item !== obj)
    }
  }
  getFields = (fields?: string[]) => {
    return fields ?? Object.keys(this.itemInstances)
  }
  clearValidate = (params?: string[]) => {
    const fields = this.getFields(params)
    fields.forEach((field) => {
      const obj = this.itemInstances[field]
      if (obj && obj.errorMsg) {
        obj.setErrorMsg()
      }
    })
  }
  bootstrap = (field: string, value: any) => {
    this.eventList.forEach((obj, index) => {
      if (obj.fields.includes(field)) {
        obj.callback?.(field, value)
      }
    })
  }
  getValue = (field: string) => get(this.formData, field)

  getValues = () => this.formData

  setValue = (field: string, value: any) => {
    const oldVal = cloneDeep(this.getValue(field))
    set(this.formData, field, value)
    this.setValues(this.formData)
    if (!this.itemInstances[field]) {
      this.bootstrap(field, { value, oldVal, row: this.getValues() })
    } else {
      this.validate([field])
    }
  }
  setValues = (data: T = {} as T) => {
    this.formData = cloneDeep(data)
    Object.entries(this.itemInstances).forEach(([field, item]) => {
      const value = this.getValue(field)
      const oldVal = item.value
      if (!isEqual(value, oldVal)) {
        item.setValue(value)
        this.bootstrap(field, { value, oldVal, row: this.getValues() })
      }
    })
  }

  validate = (params?: string[]) => {
    const fields = this.getFields(params).filter((k) => {
      const obj = this.itemInstances[k]
      return obj && (this.options.submitShow ? obj.show : true)
    })
    let data = Array.isArray(this.formData) ? [] : {}
    fields.forEach((k) => {
      set(data, k, this.getValue(k))
    })
    if (!fields.length) return Promise.resolve(data)
    const validateParams: ValidateParams = fields.reduce(
      ({ rule, source }: ValidateParams, field) => {
        const obj = this.itemInstances[field]
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
        this.clearValidate(fields)
        return data
      })
      .catch((err) => {
        const { errors = [] } = err
        errors.forEach((obj: any) => {
          this.itemInstances[obj.field].setErrorMsg(obj.message)
        })
        return Promise.reject(err)
      })
  }
  resetFields = (data?: T) => {
    this.setValues(data ?? this.formData)
    this.clearValidate()
  }
  resetField = (field: string, value?: any) => {
    this.setValue(field, get(this.formData, field))
  }
  onFiledChange = (field: string, options: any) => {
    this.setValue(field, options.value)
    this.options.onChange?.({
      field,
      value: options.value,
      e: options.e,
      formData: this.formData
    })
  }
  onLifeCycle = (type: UpdateType, field: string, comp: FormItemInstance) => {
    if (type === UpdateType.mount) {
      if (this.itemInstances[field] && this.itemInstances[field].show) {
        if (this.itemInstances[field] !== comp) {
          console.error(`重复的field字段定义: ${field}`)
        }
      }
      this.itemInstances[field] = comp
      comp.setValue(this.getValue(field))
    } else if (type === UpdateType.unmount) {
      this.clearValidate([field])
      delete this.itemInstances[field]
    }
  }
}