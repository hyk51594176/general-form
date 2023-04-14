import React, { useState } from 'react'
import { DatePicker } from 'antd'
import { Form, FormItem } from '@hanyk/general-form'
import { getList, defaultData } from '../../api'
import { HotSelect } from '../../components'
import Layout, { layoutData } from './layout'

const rules = {
  required: true,
  message: '该字段必填'
}
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [layout, setLayout] = useState(layoutData)
  const itemStyle = layout.text ? { alignItems: 'baseline' } : undefined
  const el = layout.text ? 'Text' : undefined
  return (
    <>
      <Layout onChange={setLayout} />
      <Form
        defaultData={defaultData}
        {...layout}
        style={
          layout.text
            ? {
                alignItems: 'baseline'
              }
            : undefined
        }
      >
        <FormItem
          itemStyle={itemStyle}
          label="姓名"
          rules={el ? undefined : rules}
          field="name"
          el={el ?? 'Input'}
        />
        <FormItem
          itemStyle={itemStyle}
          label="年龄"
          rules={el ? undefined : rules}
          field="age"
          el={el ?? 'Input'}
          type="number"
        />
        <FormItem
          itemStyle={itemStyle}
          label="性别"
          rules={el ? undefined : rules}
          field="sex"
          el={el ?? 'RadioGroup'}
          options={[
            { label: '男', value: 1 },
            { label: '女', value: 0 }
          ]}
        />
        <FormItem
          itemStyle={itemStyle}
          label="生日"
          rules={el ? undefined : rules}
          field="birthday"
          el={el ?? <DatePicker style={{ width: '100%' }} />}
        />
        <FormItem
          itemStyle={itemStyle}
          label="省"
          rules={el ? undefined : rules}
          field="province"
          el={el ?? <HotSelect />}
          getList={getList}
          params={{ id: 0 }}
        />
        <FormItem
          itemStyle={itemStyle}
          label="市"
          rules={el ? undefined : rules}
          field="city"
          el={el ?? <HotSelect />}
          getList={getList}
          params={{ id: 'province' }}
        />
        <FormItem
          itemStyle={itemStyle}
          label="区"
          el={el ?? <HotSelect />}
          rules={el ? undefined : rules}
          field="area"
          getList={getList}
          params={{ id: 'city' }}
        />
      </Form>
    </>
  )
}
