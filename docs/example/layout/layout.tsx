import { Common, defineColumns, Form } from '@hanyk/general-form'
import React, { useMemo } from 'react'
import { ComponentMap } from '../../components'

type LayoutData = Omit<Common, 'field'>

type Props = {
  onChange(e: LayoutData): void
}
const defaultData = {
  labelWidth: '80px',
  labelAlign: 'right'
}
const Layout: React.FC<Props> = (props: Props) => {
  const columns = useMemo(() => {
    return defineColumns<ComponentMap>([
      {
        label: 'size',
        field: 'size',
        el: 'Select',
        style: { width: '100%' },
        options: [
          { label: 'large', value: 'large' },
          { label: 'middle', value: 'middle' },
          { label: 'small', value: 'small' }
        ]
      },
      { label: 'span', field: 'span', el: 'InputNumber' },
      { label: 'offset', field: 'offset', el: 'InputNumber' },
      {
        label: 'labelAlign',
        field: 'labelAlign',
        el: 'Select',
        style: { width: '100%' },
        options: [
          { label: 'left', value: 'left' },
          { label: 'right', value: 'right' },
          { label: 'top', value: 'top' }
        ]
      },
      { label: 'labelWidth', field: 'labelWidth', el: 'Input' },
      { label: 'minItemWidth', field: 'minItemWidth', el: 'Input' },
      {
        label: 'disabled',
        field: 'disabled',
        el: 'Select',
        style: { width: '100%' },
        options: [
          { label: 'true', value: true },
          { label: 'false', value: false }
        ]
      }
    ])
  }, [])

  return (
    <Form
      columns={columns}
      onChange={(e) => props.onChange(e.formData)}
      defaultData={defaultData}
      labelWidth="100px"
      span={12}
    />
  )
}

export default Layout
