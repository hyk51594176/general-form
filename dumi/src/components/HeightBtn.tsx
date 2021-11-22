import { Button } from 'antd';
import React from 'react';
import { defineComponent } from '@hanyk/general-form';
type Props = {
  submit(data: any): void;
};

export default defineComponent<Props>((props) => {
  return (
    <div>
      <Button type="link" onClick={() => props.onChange?.(!props.value)}>
        {props.value ? '收起' : '高级搜索'}
      </Button>
      <Button
        onClick={() => {
          props.validate?.().then(props.submit);
        }}
        type="primary"
      >
        搜索
      </Button>
      &nbsp;
      <Button
        onClick={() => {
          props.resetFields?.();
        }}
      >
        重置
      </Button>
    </div>
  );
});
