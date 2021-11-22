import { Button } from 'antd';
import React from 'react';
import { defineComponent } from '@hanyk/general-form';
type Props = {
  index: number;
  tableField: string;
};

export default defineComponent<Props>((props) => {
  return (
    <>
      <Button
        size="small"
        type="link"
        onClick={() => {
          if (!props.tableField) return;
          const d = props.getValue?.(props.tableField) || [];
          d.push({});
          props.setValue?.(props.tableField, [...d]);
        }}
      >
        添加
      </Button>
      <Button
        size="small"
        type="link"
        onClick={() => {
          if (!props.tableField) return;
          const d = [...(props.getValue?.(props.tableField) || [])];
          d.splice(props.index, 1);
          console.log('d: ', JSON.stringify(d));
          props.setValue?.(props.tableField, d);
        }}
      >
        删除
      </Button>
    </>
  );
});
