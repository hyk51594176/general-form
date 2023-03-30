/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable prefer-const */
import isEqual from 'lodash/isEqual'
import React, { PropsWithChildren, useMemo, useRef, useState } from 'react'
import { RenderProps, useFormInstance } from '.'
import { FormItemProps, Rpor, UpdateType } from './interface'
import { useDeepEqualLayoutEffect } from './useDeepEqualEffect'
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
    doNotRegister,
    context: _context,
    ...other
  } = props
  const contextData = useFormInstance()
  const [, updateState] = useState({})
  const unSubscribe = useRef<any>()
  const itemRef = useRef<Rpor<any>>({} as Rpor<any>)

  const setValue = (val: any) => {
    if (!isEqual(val, itemInstance.current.value)) {
      itemInstance.current.value = val
      updateState({})
    }
  }
  const setErrorMsg = (errMsg?: string) => {
    itemInstance.current.errorMsg = errMsg
    updateState({})
  }
  const setSateShow = (flag: boolean) => {
    itemInstance.current.show = flag
    if (field) {
      contextData.clearValidate([field])
    }
    updateState({})
  }
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
              let fn = new Function(`return ${val}`)()
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
    setErrorMsg,
    errorMsg,
    setValue,
    value:
      (field ? contextData.getValue(field) : other.value) ?? other.defaultValue,
    show: getIsShow(isShow),
    rules
  })

  const isRequired = useMemo(() => {
    if (!rules) return required
    if (Array.isArray(rules)) return rules.some((item) => item.required)
    return rules.required
  }, [required, rules])

  const getTriggerType = () => {
    let triggerKey = 'onChange'
    if (!rules) return triggerKey
    return (Array.isArray(rules) ? rules : [rules]).reduce(
      (str, { trigger }) => {
        if (trigger) str = trigger
        return str
      },
      'onChange'
    )
  }

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

      const triggerType = getTriggerType() as 'onChange'
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
      setSateShow(getIsShow(isShow))
    } else {
      const keys = Object.keys(show?.relyOn ?? {})
      if (keys.length) {
        setSateShow(getIsShow(isShow))
        unSubscribe.current = contextData.subscribe(keys, () => {
          setSateShow(getIsShow(isShow))
        })
      } else {
        setSateShow(true)
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
    setErrorMsg(errorMsg)
  }, [errorMsg])

  useDeepEqualLayoutEffect(() => {
    setIsShow(isShow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow])

  useDeepEqualLayoutEffect(() => {
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
    // eslint-disable-next-line consistent-return
    ;['xs', 'sm', 'md', 'lg', 'xl'].forEach((key) => {
      const o = props[key] ?? contextData[key as keyof typeof contextData]
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
        <span className="hyk-form-item-error">
          {itemInstance.current.errorMsg}
        </span>
      </div>
    </div>
  )
}
export default FormItem
