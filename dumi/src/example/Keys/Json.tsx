import React, { useState, useMemo } from 'react';
import { Button } from 'antd';
import { defineColumns, Form } from '@hanyk/general-form';
import '@hanyk/general-form/dist/index.css';
import { useForm } from '../../hooks';
const rules = {
  required: true,
  message: '该字段必填',
};
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [data, setData] = useState<Array<{ name?: string; age?: number }>>([
    {},
  ]);
  const { formEl, submit, reset } = useForm([]);
  const columns = useMemo(() => {
    return defineColumns([
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
    ]);
  }, [data, formEl, reset, submit]);

  return (
    <Form ref={formEl} columns={columns} defaultData={data} span={8}></Form>
  );
};
