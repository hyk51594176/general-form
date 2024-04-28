import React from 'react'
import { Input, Radio, DatePicker } from 'antd'
import { Form, FormItem } from '@hanyk/general-form'
import { getList, defaultData } from '../../api'
import { HotSelect } from '../../components'
import { useSubmit } from '../../hooks'

const RadioGroup = Radio.Group
const isShow = {
  relyOn: {
    show: [true]
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const submit = useSubmit()
  return (
    <Form span={8} onChange={(e) => {}}>
      <FormItem label="姓名" field="name">
        <Input />
      </FormItem>
      <FormItem label="年龄" field="age">
        <Input type="number" />
      </FormItem>
      <FormItem label="性别" field="sex">
        <RadioGroup
          options={[
            { label: '男', value: 1 },
            { label: '女', value: 0 }
          ]}
        />
      </FormItem>
      <FormItem label="生日" field="birthday">
        <DatePicker style={{ width: '100%' }} />
      </FormItem>
      <FormItem label="省" field="province" isShow={isShow}>
        <HotSelect getList={getList} params={{ id: 0 }} />
      </FormItem>
      <FormItem label="市" field="city" isShow={isShow}>
        <HotSelect getList={getList} params={{ id: 'province' }} />
      </FormItem>
      <FormItem label="区" field="area" isShow={isShow}>
        <HotSelect getList={getList} params={{ id: 'city' }} />
      </FormItem>
      <FormItem field="show" span={10} el="HeightBtn" submit={submit} />
    </Form>
  )
}
