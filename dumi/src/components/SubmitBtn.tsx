import { Button } from 'antd';
import React from 'react';
import { RenderProps } from '@hanyk/general-form';
type Props = RenderProps & {
  submit(data: any): void;
};

const SubmitBtn: React.FC<Props> = (props) => {
  return (
    <>
      <Button
        onClick={() => {
          props.validate?.().then(props.submit);
        }}
        type="primary"
      >
        确定
      </Button>
      &nbsp;
      <Button onClick={() => props.resetFields?.()}>重置</Button>
    </>
  );
};
export default SubmitBtn;
