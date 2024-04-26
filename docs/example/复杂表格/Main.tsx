import { Form, useForm } from '@hanyk/general-form'
import React from 'react'
import { Button } from 'antd'
import Body from './Body'

function App() {
  const form = useForm({
    requestBody: {
      type: 'object',
      desc: '根节点',
      children: [
        {
          name: 'code',
          type: 'integer',
          exampleValue: '200',
          desc: '状态码',
          format: 'int32'
        },
        {
          name: 'data',
          type: 'array',
          desc: '数据集合',
          children: [
            {
              type: 'object',
              children: [
                {
                  name: 'name',
                  type: 'string',
                  exampleValue: '123',
                  desc: '姓名'
                },
                {
                  name: 'age',
                  type: 'integer',
                  exampleValue: '12',
                  desc: '年龄',
                  format: 'int32'
                },
                {
                  name: 'sex',
                  type: 'string',
                  exampleValue: '男',
                  desc: '性别'
                }
              ]
            }
          ]
        }
      ]
    }
  })

  return (
    <Form
      form={form}
      span={24}
      onChange={() => {
        console.log(form.getValues(true))
      }}
    >
      <Body />
      <Button
        onClick={() => {
          console.log(JSON.stringify(form.getValues(true)))
        }}
      >
        确定
      </Button>
    </Form>
  )
}

export default App
