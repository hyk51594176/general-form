import { Common, defineColumns, Form } from '@hanyk/general-form'
import React, { useMemo } from 'react'
import { ComponentMap } from '../../components'

export type LayoutData = Omit<Common, 'field'> & { text?: boolean }

type Props = {
  onChange(e: LayoutData): void
}
export const layoutData: LayoutData = {
  labelWidth: '80px',
  labelAlign: 'right',
  span: 8,
  minItemWidth: '100px'
}
const Layout: React.FC<Props> = (props: Props) => {
  const columns = useMemo(() => {
    return defineColumns<ComponentMap>([
      {
        label: '文本模式',
        field: 'text',
        el: 'Switch'
      },
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
      {
        label: 'minItemWidth',
        field: 'minItemWidth',
        el: 'Input'
      },

      {
        label: 'disabled',
        field: 'disabled',
        el: 'Select',
        style: { width: '100%' },
        options: [
          { label: '禁用', value: true },
          { label: '启用', value: false },
          { label: '文本', value: 'text' }
        ]
      }
    ])
  }, [])

  return (
    <Form
      columns={columns}
      onChange={(e) => {
        props.onChange({ ...e.formData } as LayoutData)
      }}
      defaultData={layoutData}
      labelWidth="100px"
      span={12}
    />
  )
}

export default Layout
