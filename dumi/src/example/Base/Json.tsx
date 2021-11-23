import React, { useMemo } from 'react';
import { defineColumns, Form } from '@hanyk/general-form';
import '@hanyk/general-form/dist/index.css';
import { getList, defaultData } from '../../api';
import { useSubmit } from '../../hooks';
import { ComponentMap } from '../../components';
import '../../components';

const rules = {
  required: true,
  message: '该字段必填',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const submit = useSubmit();
  const columns = useMemo(() => {
    return defineColumns<ComponentMap>([
      { label: '姓名', rules, field: 'name', el: 'Input' },

      { label: '年龄', rules, field: 'age', el: 'Input', type: 'number' },
      {
        label: '性别',
        rules,
        field: 'sex',
        el: 'RadioGroup',
        span: 20,
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 0 },
        ],
      },
      {
        label: '生日',
        rules,
        field: 'birthday',
        el: 'DatePicker',
        style: { width: '100%' },
        isShow: {
          relyOn: {
            sex: [0],
          },
        },
      },

      {
        label: '省',
        rules,
        field: 'province',
        el: 'HotSelect',
        span: 8,
        getList,
        params: { id: 0 },
        isShow: {
          relyOn: {
            sex: [1],
          },
        },
      },
      {
        label: '市',
        rules,
        field: 'city',
        el: 'HotSelect',
        span: 8,
        getList,
        params: { id: 'province' },

        isShow: {
          notIn: true,
          relyOn: {
            province: [undefined],
          },
        },
      },
      {
        label: '区',
        rules,
        field: 'area',
        el: 'HotSelect',
        span: 8,
        getList,
        params: { id: 'city' },

        isShow: {
          notIn: true,
          relyOn: {
            city: [undefined],
          },
        },
      },
      {
        label: '',
        span: 24,
        el: 'SubmitBtn',
        submit,
      },
    ]);
  }, [submit]);

  return <Form columns={columns} defaultData={defaultData} span={12} />;
};
