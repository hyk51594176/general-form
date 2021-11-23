import React, { useMemo } from 'react';
import { defineColumns, Form } from '@hanyk/general-form';
import { getList, defaultData } from '../../api';
import { useSubmit } from '../../hooks';
import { ComponentMap } from '../../components';

const isShow = {
  relyOn: {
    show: [true],
  },
};
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const submit = useSubmit();
  const columns = useMemo(() => {
    return defineColumns<ComponentMap>([
      { label: '姓名', field: 'name', el: 'Input' },
      { label: '年龄', field: 'age', el: 'Input', type: 'number' },
      {
        label: '性别',
        field: 'sex',
        el: 'RadioGroup',
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 0 },
        ],
      },
      {
        label: '生日',
        field: 'birthday',
        el: 'DatePicker',
        style: { width: '100%' },
      },

      {
        label: '省',
        field: 'province',
        el: 'HotSelect',
        getList,
        params: { id: 0 },
        isShow,
      },
      {
        label: '市',
        field: 'city',
        el: 'HotSelect',
        getList,
        params: { id: 'province' },

        isShow,
      },
      {
        label: '区',
        field: 'area',
        el: 'HotSelect',
        getList,
        params: { id: 'city' },

        isShow,
      },

      {
        field: 'show',
        span: 10,
        el: 'HeightBtn',
        submit,
      },
    ]);
  }, []);

  return <Form columns={columns} defaultData={defaultData} span={8} />;
};
