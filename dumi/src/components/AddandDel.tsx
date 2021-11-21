import { Button } from 'antd';
import React from 'react';
import { RenderProps } from '@hanyk/general-form';
type Props = RenderProps & {
  dataSource: any;
  index: number;
  onDataChange(data: any): void;
};

const AddandDel: React.FC<Props> = (props) => {
  return (
    <>
      <Button
        size="small"
        type="link"
        onClick={() => {
          props.onDataChange([...(props.getValues?.() as []), {}]);
        }}
      >
        添加
      </Button>
      {props.dataSource.length > 1 && (
        <Button
          size="small"
          type="link"
          onClick={() => {
            const d = props.getValues?.() as [];
            d.splice(props.index, 1);
            props.onDataChange(d);
          }}
        >
          删除
        </Button>
      )}
    </>
  );
};
export default AddandDel;
