import React from 'react';
import { Input, Radio, Button, DatePicker } from 'antd';
import { Form, FormItem } from '@hanyk/general-form';
import { getList, defaultData } from '../../api';
import HotSelect from '../../components/HotSelect';
import '@hanyk/general-form/dist/index.css';
import { useForm } from '../../hooks';
const RadioGroup = Radio.Group;
const rules = {
  required: true,
  message: '该字段必填',
};
export default () => {
  const { formEl, submit, reset } = useForm();
  return (
    <Form ref={formEl} defaultData={defaultData} span={12}>
      <FormItem rules={rules} label="姓名" field="name">
        <Input />
      </FormItem>
      <FormItem rules={rules} label="年龄" field="age">
        <Input type="number" />
      </FormItem>
      <FormItem rules={rules} label="性别" field="sex" span={20}>
        <RadioGroup
          options={[
            { label: '男', value: 1 },
            { label: '女', value: 0 },
          ]}
        />
      </FormItem>
      <FormItem
        label="生日"
        field="birthday"
        isShow={{
          relyOn: {
            sex: [0],
          },
        }}
      >
        <DatePicker style={{ width: '100%' }} />
      </FormItem>
      <FormItem
        rules={rules}
        label="省"
        field="province"
        span={8}
        isShow={{
          relyOn: {
            sex: [1],
          },
        }}
      >
        <HotSelect getList={getList} params={{ id: 0 }} />
      </FormItem>
      <FormItem
        rules={rules}
        label="市"
        field="city"
        span={8}
        whitContext
        isShow={{
          notIn: true,
          relyOn: {
            province: [undefined],
          },
        }}
      >
        <HotSelect getList={getList} params={{ id: 'province' }} />
      </FormItem>
      <FormItem
        rules={rules}
        label="区"
        field="area"
        span={8}
        whitContext
        isShow={{
          notIn: true,
          relyOn: {
            city: [undefined],
          },
        }}
      >
        <HotSelect getList={getList} params={{ id: 'city' }} />
      </FormItem>

      <FormItem label="" span={24}>
        <Button onClick={submit} type="primary">
          确定
        </Button>
        &nbsp;
        <Button onClick={reset}>重置</Button>
      </FormItem>
    </Form>
  );
};
