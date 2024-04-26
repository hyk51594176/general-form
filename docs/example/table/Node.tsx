import React, { useLayoutEffect, useState } from 'react'
import { Form, FormItem, useForm } from '@hanyk/general-form'
import { useSubmit } from '../../hooks'
import { getList } from '../../api'

const rules = {
  required: true,
  message: '该字段必填'
}
export default () => {
  const [data] = useState({
    name: '站三',
    age: '12',
    address: [{}]
  })
  const submit = useSubmit()
  const columns = [
    {
      dataIndex: 'province',
      title: '省',
      formItem: {
        el: 'HotSelect',
        getList,
        params: { id: 0 }
      }
    },
    {
      dataIndex: 'city',
      title: '市',
      formItem: {
        el: 'HotSelect',
        getList,
        params: { id: 'province' }
      }
    },
    {
      dataIndex: 'area',
      title: '区',
      formItem: {
        el: 'HotSelect',
        getList,
        params: { id: 'city' }
      }
    },
    {
      title: '操作',
      formItem: {
        el: 'TableBtn'
      }
    }
  ]
  const form = useForm()
  useLayoutEffect(() => {
    form.setValues(data)
  }, [data])
  return (
    <Form span={8} form={form}>
      <FormItem label="姓名" el="Input" field="name" rules={rules} />
      <FormItem
        label="年龄"
        el="Input"
        field="age"
        type="number"
        rules={rules}
      />
      <FormItem label="收货地址" span={24} />

      <FormItem
        field="address"
        label=""
        span={24}
        whitContext
        el="FormList"
        columns={columns}
      />

      <FormItem label="" span={24} el="SubmitBtn" submit={submit} />
    </Form>
  )
}
