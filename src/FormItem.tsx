/* eslint-disable @typescript-eslint/no-explicit-any */
import isEqual from 'lodash/isEqual'
import React, { PropsWithChildren, useMemo, useRef, useState } from 'react'
import { RenderProps, useFormInstance } from '.'
import { FormItemProps, Rpor, UpdateType } from './interface'
import { useDeepEqualLayoutEffect } from './useDeepEqualEffect'
import { components } from './utils'

const getTriggerType = (rules: FormItemProps['rules']) => {
  const triggerKey = 'onChange'
  if (!rules) return triggerKey
  return (Array.isArray(rules) ? rules : [rules]).reduce((str, { trigger }) => {
    if (trigger) str = trigger
    return str
  }, 'onChange')
}
const FormItem: React.FC<FormItemProps> = (props) => {
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
    xs,
    sm,
    md,
    lg,
    xl,
    isShow,
    content,
    doNotRegister,
    context: _context,
    ...other
  } = props
  const contextData = useFormInstance()
  const [, updateState] = useState({})
  const unSubscribe = useRef<any>()
  const itemRef = useRef<Rpor<any>>({} as Rpor<any>)

  const getIsShow = (show: FormItemProps['isShow']) => {
    if (typeof show === 'boolean') {
      return show
    }
    const keys = Object.keys(show?.relyOn ?? {})
    if (keys.length) {
      if (typeof show === 'object') {
        const method = show.relation === 'and' ? 'every' : 'some'
        let _isShow = keys[method]((k) => {
          const val = show.relyOn[k]
          let flag = true
          if (Array.isArray(val)) {
            flag = val?.includes(contextData.getValue(k))
          } else if (typeof val === 'string') {
            try {
              const fn = new Function(`return ${val}`)()
              flag = fn(contextData.getValue(k), contextData)
            } catch (error) {
              flag = false
              console.error(error)
            }
          } else {
            flag = val(contextData.getValue(k), contextData)
          }
          return show.notIn ? !flag : flag
        })
        if (typeof show.external === 'boolean') {
          _isShow =
            show.relation === 'and'
              ? _isShow && show.external
              : _isShow || show.external
        }
        return _isShow
      }
    }
    return true
  }

  const itemInstance = useRef({
    setErrorMsg(errMsg?: string) {
      itemInstance.current.errorMsg = errMsg
      updateState({})
    },
    setSateShow(flag: boolean) {
      itemInstance.current.show = flag
      if (field) {
        contextData.clearValidate([field])
      }
      updateState({})
    },
    errorMsg,
    setValue(val: any) {
      if (!isEqual(val, itemInstance.current.value)) {
        itemInstance.current.value = val
        updateState({})
      }
    },
    value:
      (field ? contextData.getValue(field) : other.value) ?? other.defaultValue,
    show: getIsShow(isShow),
    rules
  })
  itemInstance.current.rules = rules
  useDeepEqualLayoutEffect(() => {
    if (other.value !== undefined && field) {
      contextData.onFiledChange?.(field, {
        value: other.value,
        oldVal: itemInstance.current.value
      })
    }
  }, [other.value, field])
  const isRequired = useMemo(() => {
    if (!rules) return required
    if (Array.isArray(rules)) return rules.some((item) => item.required)
    return rules.required
  }, [required, rules])

  const textAlign = useMemo(
    () => labelAlign ?? contextData.labelAlign,
    [contextData.labelAlign, labelAlign]
  )
  const labelStyles = useMemo(
    () => ({
      width: labelWidth ?? contextData.labelWidth,
      textAlign: textAlign === 'top' ? 'left' : textAlign
    }),
    [contextData.labelWidth, labelWidth, textAlign]
  )

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
  const setIsShow = (show: FormItemProps['isShow']) => {
    if (unSubscribe.current) {
      unSubscribe.current()
      unSubscribe.current = null
    }
    if (typeof show === 'boolean') {
      itemInstance.current.setSateShow(getIsShow(isShow))
    } else {
      const keys = Object.keys(show?.relyOn ?? {})
      if (keys.length) {
        itemInstance.current.setSateShow(getIsShow(isShow))
        unSubscribe.current = contextData.subscribe(keys, () => {
          itemInstance.current.setSateShow(getIsShow(isShow))
        })
      } else {
        itemInstance.current.setSateShow(true)
      }
    }
  }

  useDeepEqualLayoutEffect(() => {
    if (field && !doNotRegister) {
      contextData.onLifeCycle(UpdateType.mount, field, itemInstance.current)
    }
  }, [field, doNotRegister])

  useDeepEqualLayoutEffect(() => {
    return () => {
      if (field) {
        contextData.onLifeCycle(UpdateType.unmount, field, itemInstance.current)
      }
    }
  }, [field])

  useDeepEqualLayoutEffect(() => {
    itemInstance.current.setErrorMsg(errorMsg)
  }, [errorMsg])

  useDeepEqualLayoutEffect(() => {
    setIsShow(isShow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow])

  const classNames = useMemo(() => {
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
    const arr = ['xs', 'sm', 'md', 'lg', 'xl']
    arr.forEach((key) => {
      const o =
        props[key as 'xs'] ?? contextData[key as keyof typeof contextData]
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
  }, [contextData, itemClassName, offset, props, span, textAlign])
  const getChildren = () => {
    let child: any = children ?? el
    if (child) {
      Object.assign(
        itemRef.current,
        itemInstance.current,
        contextData,
        _context ?? {},
        {
          field,
          labelWidth: labelStyles.width,
          labelAlign: textAlign
        }
      )
      const propsData: PropsWithChildren<RenderProps> = {
        context: itemRef.current,
        field,
        size: other.size ?? contextData.size,
        disabled: other.disabled ?? contextData.disabled,
        children: content,
        value: itemInstance.current.value,
        ...other,
        onChange: (val: any, ...args: any[]) => {
          handlerChange(val, ...args)
        }
      }

      const triggerType = getTriggerType(rules) as 'onChange'
      if (field && triggerType) {
        const fn = propsData[triggerType]
        propsData[triggerType] = (...args: any[]) => {
          fn?.(...args)
          contextData.validate([field])
        }
      }
      if (React.isValidElement<any>(child)) {
        child = React.cloneElement(child, {
          ...child.props,
          ...propsData,
          children: child.props.children ?? content
        })
      } else if (child.isReactClass) {
        const Comp = child
        return <Comp {...propsData} />
      } else if (typeof child === 'function') {
        child = child(propsData)
      } else if (typeof child === 'string' && components[child]) {
        const Comp = components[child]
        return <Comp {...propsData} />
      }
      return child
    }
    return itemInstance.current.value
  }
  return (
    <div
      className={classNames}
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
        <span className="hyk-form-item-error">
          {itemInstance.current.errorMsg}
        </span>
      </div>
    </div>
  )
}
export default React.memo(FormItem)
