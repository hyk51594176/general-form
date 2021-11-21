import { Button } from 'antd';
import React from 'react';
import { RenderProps } from '@hanyk/general-form';
type Props = RenderProps & {
  index: number;
  tableField: string;
};

const AddandDel: React.FC<Props> = (props) => {
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
          props.setValue?.(props.tableField, d);
        }}
      >
        删除
      </Button>
    </>
  );
};
export default AddandDel;
