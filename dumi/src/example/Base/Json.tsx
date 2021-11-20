import React, { useMemo } from 'react';
import { Input, Radio, Button, DatePicker } from 'antd';
import { defineColumns, Form, registerComponent } from '@hanyk/general-form';
import HotSelect from '../../components/HotSelect';
import '@hanyk/general-form/dist/index.css';
import { getList, defaultData } from '../../api';
import { useForm } from '../../hooks';
const RadioGroup = Radio.Group;

const components = {
  Input,
  RadioGroup,
  HotSelect,
  DatePicker,
};
registerComponent(components);
const rules = {
  required: true,
  message: '该字段必填',
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { formEl, submit, reset } = useForm();
  const columns = useMemo(() => {
    return defineColumns<typeof components>([
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
        whitContext: true,
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
        whitContext: true,
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
        el: (
          <>
            <Button onClick={submit} type="primary">
              确定
            </Button>
            &nbsp;
            <Button onClick={reset}>重置</Button>
          </>
        ),
      },
    ]);
  }, [reset, submit]);

  return (
    <Form columns={columns} ref={formEl} defaultData={defaultData} span={12} />
  );
};
