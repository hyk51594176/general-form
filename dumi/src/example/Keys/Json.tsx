import React, { useState, useMemo } from 'react';
import { Input, Button } from 'antd';
import { Form, FormItem, Column } from '@hanyk/general-form';
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
  const columns = useMemo<Column[]>(() => {
    return [
      ...data
        .map((_, index) => [
          { label: '姓名', rules, field: `[${index}]name`, el: 'Input' },
          {
            label: '年龄',
            rules,
            field: `[${index}]age`,
            el: 'Input',
            type: 'number',
          },
          {
            el: (
              <>
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
              </>
            ),
          },
        ])
        .flat(),
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
    ];
  }, [data]);

  return (
    <Form ref={formEl} columns={columns} defaultData={data} span={8}></Form>
  );
};
