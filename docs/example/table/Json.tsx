import React, { useState, useMemo } from 'react'
import { defineColumns, Form, useForm } from '@hanyk/general-form'
import { Button } from 'antd'
import { ComponentMap } from '../../components'
import { useSubmit } from '../../hooks'
import { getList } from '../../api'

const rules = {
  required: true,
  message: '该字段必填'
}
export default () => {
  const [data] = useState({
    name: '站三',
    age: '12'
  })
  const submit = useSubmit()
  const formEl = useForm()
  const columns = useMemo(() => {
    return defineColumns<ComponentMap>([
      { label: '姓名', rules, field: `name`, el: 'Input' },
      {
        label: '年龄',
        rules,
        field: `age`,
        el: 'Input',
        type: 'number'
      },
      { label: '收货地址', span: 24 },
      {
        el: 'FormList',
        label: '',
        field: 'address',
        span: 24,
        columns: [
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
      },
      {
        label: '',
        span: 24,
        submit,
        el: 'SubmitBtn'
      }
    ])
  }, [submit])

  return (
    <>
      <Button
        onClick={() => {
          formEl.setValue('address', [
            { province: 1, city: 4, area: 9 },
            { province: 1, city: 3, area: 8 }
          ])
        }}
      >
        默认值
      </Button>
      <Form columns={columns} defaultData={data} span={8} form={formEl} />
    </>
  )
}
