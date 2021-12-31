/* eslint-disable prefer-const */
import get from 'lodash/get'
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
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
  const [_errorMsg, setErrorMsg] = useState(errorMsg)
  const [_show, setShow] = useState(true)
  const [, _setValue] = useState()
  const listeners = useRef<any>()

  const setStateValue = (val: any) => {
    if (val !== itemInstance.current.value) {
      itemInstance.current.value = val
      field && contextData.bootstrap(field, val)
    } else {
      itemInstance.current.value = val
    }
    _setValue(val)
  }
  const setSateErrorMsg = (errMsg?: string) => {
    itemInstance.current.errorMsg = errMsg
    setErrorMsg(errMsg)
  }
  const setSateShow = useCallback(
    (flag: boolean) => {
      itemInstance.current.show = flag
      field && contextData.clearValidate([field])
      setShow(flag)
    },
    [contextData, field]
  )
  const itemInstance = useRef({
    setErrorMsg: setSateErrorMsg,
    errorMsg,
    setValue: setStateValue,
    value: undefined,
    show: _show,
    rules
  })
  const getClassName = () => {
    const str: string[] = []
    span = span ?? contextData.span
    offset = offset ?? contextData.offset
    if (span) {
      str.push(`col-${span}`)
    }
    if (offset) {
      str.push(`col-offset-${offset}`)
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

    return str.join(' ')
  }
  const getRequired = () => {
    if (!rules) return required
    if (Array.isArray(rules)) return rules.some((item) => item.required)
    return rules.required
  }
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
          show: _show,
          field,
          ...contextData,
          ...context
        },
        size: props.size ?? contextData.size,
        disabled: props.disabled ?? contextData.disabled,
        children: content,
        value: itemInstance.current.value,
        ...other,
        onChange: (val: any, ...args: any[]) => {
          handlerChange(val, ...args)
          if (typeof onChange === 'function') onChange(val, ...args)
        }
      }

      let status = false
      const triggerType = getTriggerType()
      if (field && triggerType) {
        const fn = propsData[triggerType]
        propsData[triggerType] = (...args: any[]) => {
          typeof fn === 'function' && fn(...args)
          if (status) return
          setTimeout(() => {
            status = false
            contextData.validate([field as string])
          }, 0)
          status = true
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
  const handlerChange = useCallback(
    (e: any, ...args: any[]) => {
      let value!: any
      try {
        value = e.target.value
      } catch (error) {
        value = e
      }
      setStateValue(value)
      if (!field) return
      contextData.onFiledChange(field, { value, e, ...args, rules })
    },
    [contextData, field, rules]
  )
  const setShowByData = useCallback(
    (keys: string[], show: FormItemProps['isShow'], data: any, change = false) => {
      if (typeof show === 'object') {
        const method = show.relation === 'and' ? 'every' : 'some'
        const _isShow = keys[method]((k) => {
          const flag = show.relyOn[k]?.includes(get(data, k))
          return show.notIn ? !flag : flag
        })
        setSateShow(_isShow)
        if (!_isShow && change) {
          handlerChange(undefined)
        }
      }
    },
    [handlerChange, setSateShow]
  )
  const setIsShow = useCallback(
    (show: FormItemProps['isShow']) => {
      listeners.current && listeners.current()
      if (typeof show === 'boolean') {
        setSateShow(show)
      } else {
        const keys = Object.keys(show?.relyOn ?? {})
        setShowByData(keys, show, contextData.getValues())
        listeners.current = contextData.subscribe(keys, (_, __, data) => {
          setShowByData(keys, show, data, true)
        })
      }
    },
    [contextData, setSateShow, setShowByData]
  )

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
  }, [field])
  useEffect(() => {
    setSateErrorMsg(errorMsg)
  }, [errorMsg])
  useEffect(() => {
    setIsShow(isShow)
  }, [isShow, setIsShow])

  useEffect(() => {
    itemInstance.current.rules = rules
  }, [rules])

  const textAlign = labelAlign ?? contextData.labelAlign
  const labelStyles = {
    width: labelWidth ?? contextData.labelWidth,
    textAlign: textAlign === 'top' ? 'left' : textAlign
  }
  const topClass = textAlign === 'top' ? 'hyk-form-item-top' : ''
  return _show ? (
    <div
      className={`hyk-form-item  ${topClass} ${getClassName()} ${itemClassName ?? ''}`}
      style={{
        minWidth: minItemWidth ?? contextData.minItemWidth,
        ...itemStyle
      }}
    >
      {label !== undefined && (
        <label
          title={typeof label === 'string' ? label : ''}
          className={`hyk-form-item-label ${getRequired() ? 'required' : ''}`}
          style={labelStyles}
        >
          {label}
        </label>
      )}
      <div className="hyk-form-item-container hyk-form-item-container_error ">
        {getChildren()}
        <span className="hyk-form-item-error">{_errorMsg}</span>
      </div>
    </div>
  ) : null
}
export default FormItem
