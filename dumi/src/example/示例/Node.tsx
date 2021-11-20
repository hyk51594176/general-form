import React from 'react';
import { Input, Radio, Button, DatePicker } from 'antd';
import { Form, FormItem } from '@hanyk/general-form';
import { getList, defaultData } from '../../api';
import HotSelect from '../../components/HotSelect';
import '@hanyk/general-form/dist/index.css';
import { useForm } from '../../hooks';
const RadioGroup = Radio.Group;
const isShow = {
  relyOn: {
    show: [true],
  },
};
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { formEl, submit, reset } = useForm();
  return (
    <Form ref={formEl} defaultData={defaultData} span={8} onChange={(e) => {}}>
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
            { label: '女', value: 0 },
          ]}
        />
      </FormItem>
      <FormItem label="生日" field="birthday">
        <DatePicker style={{ width: '100%' }} />
      </FormItem>
      <FormItem label="省" field="province" isShow={isShow}>
        <HotSelect getList={getList} params={{ id: 0 }} />
      </FormItem>
      <FormItem label="市" field="city" whitContext isShow={isShow}>
        <HotSelect getList={getList} params={{ id: 'province' }} />
      </FormItem>
      <FormItem label="区" field="area" whitContext isShow={isShow}>
        <HotSelect getList={getList} params={{ id: 'city' }} />
      </FormItem>
      <FormItem field="show" span={10}>
        {(props) => (
          <div>
            <Button type="link" onClick={() => props.onChange(!props.value)}>
              {props.value ? '收起' : '高级搜索'}
            </Button>
            <Button onClick={submit} type="primary">
              搜索
            </Button>
            &nbsp;
            <Button onClick={reset}>重置</Button>
          </div>
        )}
      </FormItem>
    </Form>
  );
};
