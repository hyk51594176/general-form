import React, { useState } from 'react';
import { DatePicker } from 'antd';
import { Form, FormItem } from '@hanyk/general-form';
import { getList, defaultData } from '../../api';
import { HotSelect } from '../../components';
import Layout from './layout';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [layout, setLayout] = useState({});

  return (
    <>
      <Layout onChange={setLayout} />
      <Form defaultData={defaultData} {...layout}>
        <FormItem label="姓名" field="name" el="Input" />
        <FormItem label="年龄" field="age" el="Input" type="number" />
        <FormItem
          label="性别"
          field="sex"
          el="RadioGroup"
          options={[
            { label: '男', value: 1 },
            { label: '女', value: 0 },
          ]}
        />
        <FormItem label="生日" field="birthday">
          <DatePicker style={{ width: '100%' }} />
        </FormItem>
        <FormItem label="省" field="province">
          <HotSelect getList={getList} params={{ id: 0 }} />
        </FormItem>
        <FormItem label="市" field="city">
          <HotSelect getList={getList} params={{ id: 'province' }} />
        </FormItem>
        <FormItem label="区" field="area">
          <HotSelect getList={getList} params={{ id: 'city' }} />
        </FormItem>
      </Form>
    </>
  );
};
