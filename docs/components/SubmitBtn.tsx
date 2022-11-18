import { Button } from 'antd';
import React from 'react';
import { defineComponent } from '@hanyk/general-form';
type Props = {
  submit(data: any): void;
};

export default defineComponent<Props>((props) => {
  return (
    <>
      <Button
        onClick={() => {
          props.context?.validate().then(props.submit);
        }}
        type="primary"
      >
        确定
      </Button>
      &nbsp;
      <Button onClick={() => props.context?.resetFields()}>重置</Button>
    </>
  );
});
