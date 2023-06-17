/* eslint-disable @typescript-eslint/ban-types */
import Schema from 'async-validator'
import get from 'lodash/get'
import set from 'lodash/set'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import {
  SubCallback,
  EventItem,
  FormItemInstances,
  ValidateParams,
  EventArg,
  UpdateType,
  FormItemInstance
} from './interface'

type Options<T> = {
  submitShow?: boolean
  onChange?: (arg: EventArg<T>) => void
}
export default class Store<T = {}> {
  private options: Options<T> = {
    submitShow: true
  }

  formData!: T

  private originFormData!: T

  private preFromData!: T

  private eventList: Array<EventItem> = []

  private itemInstances: FormItemInstances = {}

  constructor(defaultData?: T) {
    this.setValues(defaultData)
  }

  setOptions(options: Options<T>) {
    Object.assign(this.options, options)
  }

  private getItemInstance = (field: string) => {
    return this.itemInstances[field]?.find((obj) => obj.show)
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
      const obj = this.getItemInstance(field)
      if (obj && obj.errorMsg) {
        obj.setErrorMsg()
      }
    })
  }

  bootstrap = (field: string, value: any) => {
    this.eventList.forEach((obj) => {
      if (obj.fields.includes(field)) {
        obj.callback?.(field, value)
      }
    })
  }

  getValue = (field: string) => get(this.formData, field)

  getValues = () => this.formData

  setValue = (field: string, value: any, validate = true) => {
    set(this.formData as Object, field, value)
    this.setValues(this.formData, true)
    if (this.itemInstances[field]) {
      if (validate) {
        this.validate([field])
      }
    }
  }

  setValues = (data: T = {} as T, isChange?: boolean) => {
    this.formData = cloneDeep(data)
    if (!isChange) {
      this.originFormData = data
    }
    const eventKeys = this.eventList.map((o) => o.fields).flat()
    const instanceKeys = Object.keys(this.itemInstances)
    const keys = Array.from(new Set([...eventKeys, ...instanceKeys]))
    keys.forEach((field) => {
      const value = get(data, field)
      const item = this.itemInstances[field]?.[0]
      let oldVal = item?.value
      if (!item) {
        oldVal = get(this.preFromData, field)
      }
      if (!isEqual(value, oldVal)) {
        this.itemInstances[field]?.forEach((obj) => {
          obj?.setValue?.(value)
        })
        this.bootstrap(field, { value, oldVal, row: this.getValues() })
      }
    })
    this.preFromData = data
  }

  validate = (params?: string[]) => {
    const fields = this.getFields(params).filter((field) => {
      return this.itemInstances[field]?.some(
        (obj) => obj && (this.options.submitShow ? obj.show : true)
      )
    })
    const data = Array.isArray(this.formData) ? [] : {}
    fields.forEach((k) => {
      set(data, k, this.getValue(k))
    })
    if (!fields.length) return Promise.resolve(data)
    const validateParams: ValidateParams = fields.reduce(
      ({ rule, source }: ValidateParams, field) => {
        const obj =
          this.getItemInstance(field) ?? this.itemInstances[field]?.[0]
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
          const item = this.getItemInstance(obj.field)
          item?.setErrorMsg(obj.message)
        })
        return Promise.reject(err)
      })
  }

  resetFields = (data?: T) => {
    this.setValues(data ?? this.originFormData)
    this.clearValidate()
  }

  resetField = (field: string, value?: any) => {
    this.setValue(field, value ?? get(this.originFormData, field))
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

  onLifeCycle = (field: string, comp: FormItemInstance) => {
    if (this.itemInstances[field]) {
      this.itemInstances[field].push(comp)
      console.error(`重复定义的field=>>${field}`)
    } else {
      this.itemInstances[field] = [comp]
    }
    if (comp.show) {
      const value = this.getValue(field)
      if (value === undefined) {
        if (comp.value !== undefined) {
          set(this.formData as Object, field, comp.value)
        }
      } else {
        comp.setValue(value)
      }
    }
    return () => {
      comp.setErrorMsg()
      this.itemInstances[field] = this.itemInstances[field]?.filter(
        (o) => o !== comp
      )
      if (!this.itemInstances[field]?.length) {
        delete this.itemInstances[field]
      }
    }
  }
}
