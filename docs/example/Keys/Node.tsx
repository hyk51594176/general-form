import React, { useState } from 'react';
import { Input } from 'antd';
import { Form, FormItem } from '@hanyk/general-form';
import { useSubmit } from '../../hooks';
import AddandDel from '../../components/AddandDel';
const rules = {
  required: true,
  message: '该字段必填',
};
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [data, setData] = useState<Array<{ name?: string; age?: number }>>([
    {},
  ]);
  const submit = useSubmit();
  return (
    <Form defaultData={data} span={6}>
      {data
        .map((_, index) => {
          return [
            <FormItem rules={rules} label="姓名" field={`[${index}].name`}>
              <Input />
            </FormItem>,
            <FormItem rules={rules} label="年龄" field={`[${index}].age`}>
              <Input type="number" />
            </FormItem>,
            <FormItem>
              <AddandDel
                index={index}
                dataSource={data}
                onDataChange={setData}
              />
            </FormItem>,
          ];
        })
        .flat()}
      <FormItem label="" span={24} el="SubmitBtn" submit={submit} />
    </Form>
  );
};
