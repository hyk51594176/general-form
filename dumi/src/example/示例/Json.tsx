import React, { useMemo } from 'react';
import { Input, Radio, Button, DatePicker } from 'antd';
import { Column, Form, registerComponent } from '@hanyk/general-form';
import HotSelect from '../../components/HotSelect';
import '@hanyk/general-form/dist/index.css';
import { getList, defaultData } from '../../api';
import { useForm } from '../../hooks';
const RadioGroup = Radio.Group;

registerComponent({
  Input,
  RadioGroup,
  HotSelect,
  DatePicker,
});

const isShow = {
  relyOn: {
    show: [true],
  },
};
export default () => {
  const { formEl, submit, reset } = useForm();
  const columns = useMemo<Column[]>(() => {
    return [
      { label: '姓名', field: 'name', el: 'Input' },
      { label: '年龄', field: 'age', el: 'Input', type: 'number' },
      {
        label: '性别',

        field: 'sex',
        el: 'RadioGroup',
        type: 'number',
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
        whitContext: true,
        isShow,
      },
      {
        label: '区',

        field: 'area',
        el: 'HotSelect',
        getList,
        params: { id: 'city' },
        whitContext: true,
        isShow,
      },

      {
        field: 'show',
        span: 10,
        el: (props) => {
          return (
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
          );
        },
      },
    ];
  }, []);

  return (
    <Form columns={columns} ref={formEl} defaultData={defaultData} span={8} />
  );
};
