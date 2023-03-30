import React, { useState, useMemo } from 'react'
import { defineColumns, Form } from '@hanyk/general-form'
import { ComponentMap } from '../../components'
import { useSubmit } from '../../hooks'

const rules = {
  required: true,
  message: '该字段必填'
}
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [data, setData] = useState<Array<{ name?: string; age?: number }>>([{}])
  const submit = useSubmit()
  const columns = useMemo(() => {
    return defineColumns<ComponentMap>([
      ...data
        .map((_, index) => [
          { label: '姓名', rules, field: `[${index}]name`, el: 'Input' },
          {
            label: '年龄',
            rules,
            field: `[${index}]age`,
            el: 'Input',
            type: 'number'
          },
          {
            el: 'AddandDel',
            index,
            onDataChange: setData,

            dataSource: data
          }
        ])
        .flat(),
      {
        label: '',
        span: 24,
        submit,
        el: 'SubmitBtn'
      }
    ])
  }, [data, submit])

  return <Form columns={columns} defaultData={data} span={6} />
}
