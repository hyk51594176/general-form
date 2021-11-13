import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Form, FormItem } from '@hanyk/general-form';
import '@hanyk/general-form/dist/index.css';
import { useForm } from '../../hooks';
const rules = {
  required: true,
  message: '该字段必填',
};
export default () => {
  const [data, setData] = useState<Array<{ name?: string; age?: number }>>([
    {},
  ]);
  const { formEl, submit, reset } = useForm([]);
  return (
    <Form ref={formEl} defaultData={data} span={8}>
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
              <Button
                size="small"
                type="link"
                onClick={() => {
                  setData([...(formEl.current?.getValues() as []), {}]);
                }}
              >
                添加
              </Button>
              {data.length > 1 && (
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    const d = formEl.current?.getValues() as [];
                    d.splice(index, 1);
                    setData(d);
                  }}
                >
                  删除
                </Button>
              )}
            </FormItem>,
          ];
        })
        .flat()}
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
