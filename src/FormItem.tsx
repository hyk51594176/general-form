import React from 'react'

import { components, isDiff } from './utils'

import { FormItemProps, UpdateType, DefaultItemProps } from './interface'
import get from 'lodash/get'

interface State {
  value: unknown
  errorMsg?: string,
  show: boolean
}
export default class FormItem extends React.Component<FormItemProps, State> {
  static defaultProps: DefaultItemProps = {
    onFiledChange() {},
    onLifeCycle() {},
    subscribe() {
      // eslint-disable-next-line @typescript-eslint/semi
      return () => {}
    },
    getValue() {},
    getValues() {
      return {}
    },
    setValue() {},
    setValues() {},
    validate() {
      return Promise.resolve({})
    }
  }

  constructor(props: FormItemProps) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue,
      errorMsg: props.errorMsg,
      show: typeof props.isShow === 'boolean' ? props.isShow : true
    }
  }

  unSubscribe=() => {}

  componentDidMount() {
    const { field, onLifeCycle, isShow } = this.props
    field && onLifeCycle(UpdateType.mount, field, this)
    this.setShow(isShow)
  }

  componentWillReceiveProps(nexProps: FormItemProps) {
    if (isDiff(nexProps.value, this.props.value)) {
      this.setState({ value: nexProps.value })
    }
    if (isDiff(this.props.errorMsg, nexProps.errorMsg)) {
      this.setErrorMsg(nexProps.errorMsg)
    }
    if (nexProps.isShow !== this.props.isShow) {
      this.setShow(nexProps.isShow)
    }
  }

  setShow(show: FormItemProps['isShow']) {
    this.unSubscribe()
    if (typeof show === 'boolean') {
      this.setState({ show })
    } else {
      const keys = Object.keys(show?.relyOn || {})
      this.setShowByData(keys, show, this.props.getValues())
      this.unSubscribe = this.props.subscribe(keys, (_, __, data) => {
        this.setShowByData(keys, show, data)
      })
    }
  }

  setShowByData(keys: string[], show: FormItemProps['isShow'], data:any) {
    if (typeof show === 'object') {
      const method = show.relation === 'and' ? 'every' : 'some'
      const isShow = keys[method](k => {
        const flag = show.relyOn[k].includes(get(data, k))
        return show.notIn ? !flag : flag
      })
      this.setState({ show: isShow })
    }
  }

  componentWillUnmount() {
    const { field, onLifeCycle } = this.props
    field && onLifeCycle(UpdateType.unmount, field, this)
    this.unSubscribe()
  }

  get triggerType() {
    const { rules } = this.props
    let triggerKey: string | undefined
    if (!rules) return triggerKey
    return (Array.isArray(rules) ? rules : [rules]).reduce(
      (str, { trigger }) => {
        // eslint-disable-next-line no-param-reassign
        if (trigger) str = trigger
        return str
      },
      'onChange'
    )
  }

  get required() {
    const { required, rules } = this.props
    if (!rules) return required
    if (Array.isArray(rules)) return rules.some((item) => item.required)
    return rules.required
  }

  get children() {
    const {
      el,
      field,
      span,
      offset,
      label,
      labelWidth,
      minItemWidth,
      itemClassName,
      itemStyle,
      labelAlign,
      required,
      rules,
      errorMsg,
      onChange,
      children,
      onFiledChange,
      onLifeCycle,
      subscribe,
      getValue,
      getValues,
      setValue,
      setValues,
      validate,
      xs,
      sm,
      md,
      lg,
      xl,
      isShow,
      ...other
    } = this.props
    const { value, show } = this.state
    let child: any = children || el
    if (child) {
      const props: any = {
        value,
        ...other,
        onChange: (val: any, ...args: any[]) => {
          this.onChange(val, ...args)
          if (typeof onChange === 'function') onChange(val, ...args)
        }
      }
      if (field && this.triggerType) {
        const fn = props[this.triggerType]
        props[this.triggerType] = (...args: any[]) => {
          typeof fn === 'function' && fn(...args)
          setTimeout(() => {
            validate([field])
          }, 0)
        }
      }
      if (React.isValidElement<any>(child)) {
        child = React.cloneElement(child, {
          ...child.props,
          ...props,
          disabled: props.disabled
        })
      } else if (typeof child === 'function') {
        child = child({
          ...props,
          show,
          onFiledChange,
          onLifeCycle,
          subscribe,
          getValue,
          getValues,
          setValue,
          setValues,
          validate
        })
      } else if (typeof child === 'string' && components[child]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const Comp = components[child]
        return <Comp {...props} />
      }
      return child
    }
    return value
  }

  setErrorMsg = (errorMsg?: string) => {
    this.setState({ errorMsg })
  }

  setValue = (value: any, cb?: () => void) => {
    this.setState({ value }, cb)
  }

  onChange = (e: any, ...args: any[]) => {
    const { field, onFiledChange } = this.props
    let value!: any
    try {
      value = e.target.value
    } catch (error) {
      value = e
    }
    this.setState({ value }, () => {
      if (!field) return
      onFiledChange(field, { value, e, ...args })
    })
  }

  get computedClassName() {
    const { span, offset } = this.props
    const str: string[] = []
    if (span) {
      str.push(`col-${span}`)
    }
    if (offset) {
      str.push(`col-offset-${offset}`)
    }
    ;['xs', 'sm', 'md', 'lg', 'xl'].forEach((key) => {
      const o = this.props[key]
      if (!o) return
      if (typeof o === 'object') {
        if (o.span) {
          str.push(`col-${key}-${o.span}`)
        }
        if (o.offset) {
          str.push(`col-${key}-offset-${o.offset}`)
        }
      } else {
        str.push(`col-${key}-${o}`)
      }
    })

    return str.join(' ')
  }

  render() {
    const {
      labelWidth,
      labelAlign,
      label,
      minItemWidth,
      itemClassName = '',
      itemStyle = {}
    } = this.props
    const labelStyles = {
      width: labelWidth,
      textAlign: labelAlign
    }
    const { errorMsg, show } = this.state
    return (
      show ? <div
        className={`hyk-form-item ${this.computedClassName} ${itemClassName}`}
        style={{ minWidth: minItemWidth, ...itemStyle }}
      >
        {label !== undefined && (
          <label
            title={typeof label === 'string' ? label : ''}
            className={`hyk-form-item-label ${this.required ? 'required' : ''}`}
            style={labelStyles}
          >
            {label}
          </label>
        )}
        <div className="hyk-form-item-container">
          {this.children}
          <span className="hyk-form-item-error">{errorMsg}</span>
        </div>
      </div> : null
    )
  }
}
