import { Button } from 'antd';
import React from 'react';
import { defineComponent } from '@hanyk/general-form';
type Props = {
  dataSource: any;
  index: number;
  onDataChange(data: any): void;
};

export default defineComponent<Props>((props) => {
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
});
