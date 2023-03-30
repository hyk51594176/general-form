import React, { useMemo, useState } from 'react'
import { defineColumns, Form } from '@hanyk/general-form'
import { getList, defaultData } from '../../api'
import { ComponentMap } from '../../components'
import Layout from './layout'

const rules = {
  required: true,
  message: '该字段必填'
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [layout, setLayout] = useState({})
  const columns = useMemo(() => {
    return defineColumns<ComponentMap>([
      { label: '姓名', rules, field: 'name', el: 'Input' },

      { label: '年龄', rules, field: 'age', el: 'Input', type: 'number' },
      {
        label: '性别',
        rules,
        field: 'sex',
        el: 'RadioGroup',

        options: [
          { label: '男', value: 1 },
          { label: '女', value: 0 }
        ]
      },
      {
        label: '生日',
        rules,
        field: 'birthday',
        el: 'DatePicker',
        style: { width: '100%' }
      },

      {
        label: '省',
        rules,
        field: 'province',
        el: 'HotSelect',
        getList,
        params: { id: 0 }
      },
      {
        label: '市',
        rules,
        field: 'city',
        el: 'HotSelect',
        getList,
        params: { id: 'province' }
      },
      {
        label: '区',
        rules,
        field: 'area',
        el: 'HotSelect',
        getList,
        params: { id: 'city' }
      }
    ])
  }, [])

  return (
    <>
      <Layout onChange={setLayout} />
      <Form columns={columns} defaultData={defaultData} {...layout} />
    </>
  )
}
