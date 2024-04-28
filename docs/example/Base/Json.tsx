import React, { useLayoutEffect, useMemo } from 'react'
import { defineColumns, Form, useForm } from '@hanyk/general-form'
import { defaultData, getList } from '../../api'
import { useSubmit } from '../../hooks'
import { ComponentMap } from '../../components'

const rules = {
  required: true,
  message: '该字段必填'
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const submit = useSubmit()
  const form = useForm()
  useLayoutEffect(() => {
    form.setValues(defaultData)
  }, [])
  const columns = useMemo(() => {
    return defineColumns<ComponentMap, any>([
      { label: '姓名', rules, field: 'name', el: 'Input' },
      { label: '年龄', rules, field: 'age', el: 'Input', type: 'number' },
      {
        label: '性别',
        rules,
        field: 'sex',
        el: 'RadioGroup',
        span: 20,
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
        style: { width: '100%' },
        isShow: {
          relyOn: {
            sex: [0]
          }
        }
      },

      {
        label: '省',
        rules,
        field: 'province',
        el: 'HotSelect',
        span: 8,
        getList,
        params: { id: 0 },
        isShow: {
          relyOn: {
            sex: [1]
          }
        }
      },
      {
        label: '市',
        rules,
        field: 'city',
        el: 'HotSelect',
        span: 8,
        getList,
        params: { id: 'province' },
        isShow: {
          notIn: true,
          relation: 'and',
          relyOn: {
            province: [undefined],
            sex: [0]
          }
        }
      },
      {
        label: '区',
        rules,
        field: 'area',
        el: 'HotSelect',
        span: 8,
        getList,
        params: { id: 'city' },
        isShow: {
          notIn: true,
          relation: 'and',
          relyOn: {
            city: [undefined],
            sex: [0]
          }
        }
      },
      {
        label: '',
        span: 24,
        el: 'SubmitBtn',
        submit
      }
    ])
  }, [submit])

  return <Form columns={columns} span={12} form={form} />
}
