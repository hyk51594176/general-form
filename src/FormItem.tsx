/* eslint-disable prefer-const */
import isEqual from 'lodash/isEqual'
import React, { PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { RenderProps } from '.'
import Context from './Context'
import { FormItemProps, UpdateType } from './interface'
import { components } from './utils'

const FormItem: React.FC<FormItemProps> = (props) => {
  let {
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
    xs,
    sm,
    md,
    lg,
    xl,
    isShow,
    content,
    context = {},
    ...other
  } = props
  const contextData = useContext(Context)
  const [, updateState] = useState({})
  const unSubscribe = useRef<any>()

  const setValue = (val: any) => {
    if (val !== itemInstance.current.value) {
      itemInstance.current.value = val
    } else {
      itemInstance.current.value = val
    }
    updateState({})
  }
  const setErrorMsg = (errMsg?: string) => {
    itemInstance.current.errorMsg = errMsg
    updateState({})
  }
  const setSateShow = (flag: boolean) => {
    itemInstance.current.show = flag
    field && contextData.clearValidate([field])
    updateState({})
  }
  const itemInstance = useRef({
    setErrorMsg,
    errorMsg,
    setValue,
    value: props.value,
    show: true,
    rules
  })

  const isRequired = useMemo(() => {
    if (!rules) return required
    if (Array.isArray(rules)) return rules.some((item) => item.required)
    return rules.required
  }, [required, rules])
  const getTriggerType = () => {
    let triggerKey: string | undefined
    if (!rules) return triggerKey
    return (Array.isArray(rules) ? rules : [rules]).reduce((str, { trigger }) => {
      // eslint-disable-next-line no-param-reassign
      if (trigger) str = trigger
      return str
    }, 'onChange')
  }

  const getChildren = () => {
    let child: any = children ?? el
    if (child) {
      const propsData: PropsWithChildren<RenderProps> = {
        context: {
          show: itemInstance.current.show,
          field,
          ...contextData,
          labelWidth: labelStyles.width,
          labelAlign: textAlign,
          ...context
        },
        size: props.size ?? contextData.size,
        disabled: props.disabled ?? contextData.disabled,
        children: content,
        value: itemInstance.current.value,
        ...other,
        onChange: (val: any, ...args: any[]) => {
          handlerChange(val, ...args)
        }
      }

      const triggerType = getTriggerType()
      if (field && triggerType) {
        const fn = propsData[triggerType]
        propsData[triggerType] = (...args: any[]) => {
          fn?.(...args)
          contextData.validate([field as string])
        }
      }
      if (React.isValidElement<any>(child)) {
        child = React.cloneElement(child, {
          ...child.props,
          ...propsData,
          children: child.props.children ?? content
        })
      } else if (typeof child === 'function') {
        child = child(propsData)
      } else if (typeof child === 'string' && components[child]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const Comp = components[child]
        return <Comp {...propsData} />
      }
      return child
    }
    return itemInstance.current.value
  }
  const handlerChange = (e: any, ...args: any[]) => {
    let value!: any
    try {
      value = e.target.value
    } catch (error) {
      value = e
    }
    if (isEqual(value, itemInstance.current.value)) return
    if (field) {
      contextData.onFiledChange(field, {
        value,
        e,
        ...args,
        rules,
        oldVal: itemInstance.current.value
      })
    }
    onChange?.(e, ...args)
  }
  const setShowByData = (keys: string[], show: FormItemProps['isShow']) => {
    if (typeof show === 'object') {
      const method = show.relation === 'and' ? 'every' : 'some'
      const _isShow = keys[method]((k) => {
        const flag = show.relyOn[k]?.includes(contextData.getValue(k))
        return show.notIn ? !flag : flag
      })
      setSateShow(_isShow)
    }
  }
  const setIsShow = (show: FormItemProps['isShow']) => {
    unSubscribe.current && unSubscribe.current()
    if (typeof show === 'boolean') {
      setSateShow(show)
    } else {
      const keys = Object.keys(show?.relyOn ?? {})
      setShowByData(keys, show)
      unSubscribe.current = contextData.subscribe(keys, (_, __) => {
        setShowByData(keys, show)
      })
    }
  }

  useEffect(() => {
    if (field) {
      contextData.onLifeCycle(UpdateType.mount, field, itemInstance.current)
    }
    return () => {
      if (field) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        contextData.onLifeCycle(UpdateType.unmount, field, itemInstance.current)
      }
    }
  }, [contextData, field])

  useEffect(() => {
    setErrorMsg(errorMsg)
  }, [errorMsg])

  useEffect(() => {
    setIsShow(isShow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow])

  useEffect(() => {
    itemInstance.current.rules = rules
  }, [rules])

  const textAlign = labelAlign ?? contextData.labelAlign
  const labelStyles = {
    width: labelWidth ?? contextData.labelWidth,
    textAlign: textAlign === 'top' ? 'left' : textAlign
  }

  const getClassName = () => {
    const str: string[] = ['hyk-form-item']
    const _span = span ?? contextData.span
    const _offset = offset ?? contextData.offset
    const topClass = textAlign === 'top' ? 'hyk-form-item-top' : ''
    const errorClass = itemInstance.current.errorMsg ? 'item_error' : ''
    if (_span) {
      str.push(`col-${_span}`)
    }
    if (_offset) {
      str.push(`col-offset-${_offset}`)
    }
    ;['xs', 'sm', 'md', 'lg', 'xl'].forEach((key) => {
      const o = props[key] ?? contextData[key]
      if (!o) return ''
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
    if (topClass) {
      str.push(topClass)
    }
    if (errorClass) {
      str.push(errorClass)
    }
    if (itemClassName) {
      str.push(itemClassName)
    }
    return str.join(' ')
  }
  return (
    <div
      className={getClassName()}
      style={{
        minWidth: minItemWidth ?? contextData.minItemWidth,
        ...itemStyle,
        display: itemInstance.current.show ? undefined : 'none'
      }}
    >
      {label !== undefined && (
        <label
          title={typeof label === 'string' ? label : ''}
          className={`hyk-form-item-label ${isRequired ? 'required' : ''}`}
          style={labelStyles}
        >
          {label}
        </label>
      )}
      <div className="hyk-form-item-container">
        {getChildren()}
        <span className="hyk-form-item-error">{itemInstance.current.errorMsg}</span>
      </div>
    </div>
  )
}
export default FormItem
