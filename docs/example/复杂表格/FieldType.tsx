/* eslint-disable consistent-return */
import React, { useEffect, useMemo } from 'react'
import { defineComponent, useWatch } from '@hanyk/general-form'
import { Select } from 'antd'

const list = [
  {
    label: 'integer',
    value: 'integer',
    children: [
      { label: 'int32', value: 'int32' },
      { label: 'int64', value: 'int64' }
    ]
  },
  {
    label: 'number',
    value: 'number',
    children: [
      { label: 'float', value: 'float' },
      { label: 'double', value: 'double' }
    ]
  },
  {
    label: 'string',
    value: 'string',
    children: [
      { label: '', value: '' },
      { label: 'byte', value: 'byte' },
      { label: 'binary', value: 'binary' },
      { label: 'date', value: 'date' },
      { label: 'date-time', value: 'date-time' },
      { label: 'password', value: 'password' }
    ]
  },
  { label: 'boolean', value: 'boolean' },
  { label: 'object', value: 'object' },
  { label: 'array', value: 'array' }
]

type Props = {
  otherField?: string
  parentKey?: string
  isBase?: boolean
}

export default defineComponent<Props>(
  ({ size, context, value, parentKey, otherField, isBase, ...props }) => {
    const otherKey = `${parentKey}.${otherField}`
    const [val] = useWatch<string>(otherKey)
    const typeList = useMemo(() => {
      if (isBase) {
        return list.filter(
          (obj) => obj.value !== 'object' && obj.value !== 'array'
        )
      }
      return list
    }, [isBase])
    const options = useMemo(() => {
      return typeList.find((item) => item.value === value)?.children
    }, [typeList, value])

    useEffect(() => {
      if (val) {
        if (!options?.find((item) => item.value === val)) {
          context?.setValue(otherKey, undefined)
        }
      }
      if (value === 'integer' && !context?.getValue(otherKey)) {
        context?.setValue(otherKey, 'int32')
      }
      if (value === 'number' && !context?.getValue(otherKey)) {
        context?.setValue(otherKey, 'float')
      }
    }, [options])
    useEffect(() => {
      if (!['object', 'array', 'boolean'].includes(value)) {
        return context?.onLifeCycle(otherKey, { show: true } as any)
      }
    }, [value])
    return (
      <>
        <Select
          style={{ width: '50%' }}
          options={typeList}
          value={value}
          {...props}
        />
        {options && (
          <Select
            style={{ width: '50%' }}
            value={val}
            options={options}
            {...props}
            onChange={(e) => {
              context?.onFiledChange(otherKey, { value: e })
            }}
          />
        )}
      </>
    )
  }
)
