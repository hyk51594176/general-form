import React from 'react';
import { DatePicker } from 'antd';
import { Form, FormItem } from '@hanyk/general-form';
import { getList, defaultData } from '../../api';
import HotSelect from '../../components/HotSelect';
import SubmitBtn from '../../components/SubmitBtn';
import { useSubmit } from '../../hooks';
const rules = {
  required: true,
  message: '该字段必填',
};
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const submit = useSubmit();
  return (
    <Form defaultData={defaultData} span={12}>
      <FormItem rules={rules} label="姓名" field="name" el="Input" />
      <FormItem
        rules={rules}
        label="年龄"
        field="age"
        el="Input"
        type="number"
      />
      <FormItem
        rules={rules}
        label="性别"
        field="sex"
        span={20}
        el="RadioGroup"
        options={[
          { label: '男', value: 1 },
          { label: '女', value: 0 },
        ]}
      />
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

      <FormItem label="" span={24} whitContext>
        <SubmitBtn submit={submit} />
      </FormItem>
    </Form>
  );
};
