import React, { useState, useMemo } from 'react';
import { defineColumns, Form } from '@hanyk/general-form';
import { ComponentMap } from '../../components';
import { useSubmit } from '../../hooks';
import { getList } from '../../api';
const rules = {
  required: true,
  message: '该字段必填',
};
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [data] = useState({
    name: '站三',
    age: '12',
    address: [{}],
  });
  const submit = useSubmit();
  const columns = useMemo(() => {
    return defineColumns<ComponentMap>([
      { label: '姓名', rules, field: `name`, el: 'Input' },
      {
        label: '年龄',
        rules,
        field: `age`,
        el: 'Input',
        type: 'number',
      },
      { label: '收货地址', span: 24 },
      {
        el: 'FormList',
        label: '',
        field: 'address',
        span: 24,
        whitContext: true,
        columns: [
          {
            dataIndex: 'province',
            title: '省',
            formItem: {
              el: 'HotSelect',
              getList,
              tableField: 'address',
              whitContext: true,
              params: { id: 0 },
            },
          },
          {
            dataIndex: 'city',
            title: '市',
            formItem: {
              el: 'HotSelect',
              getList,
              tableField: 'address',
              whitContext: true,
              params: { id: 'province' },
            },
          },
          {
            dataIndex: 'area',
            title: '区',
            formItem: {
              el: 'HotSelect',
              getList,
              tableField: 'address',
              whitContext: true,
              params: { id: 'city' },
            },
          },
          {
            title: '操作',
            formItem: {
              el: 'TableBtn',
              tableField: 'address',
              whitContext: true,
            },
          },
        ],
      },
      {
        label: '',
        span: 24,
        submit,
        el: 'SubmitBtn',
        whitContext: true,
      },
    ]);
  }, [submit]);

  return <Form columns={columns} defaultData={data} span={8}></Form>;
};
