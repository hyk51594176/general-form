import { Form } from '@hanyk/general-form';
import { useRef, useCallback } from 'react';
import { Modal } from 'antd';
export const useForm = (defaultData = {}) => {
  const formEl = useRef<Form>(null);
  const submit = useCallback(async () => {
    try {
      const data = await formEl.current?.validate();
      console.log('data: ', data);
      Modal.success({
        title: '操作成功',
        content: JSON.stringify(data),
      });
    } catch (error) {}
  }, []);
  const reset = useCallback(() => {
    formEl.current?.resetFields(defaultData);
  }, []);
  return {
    formEl,
    submit,
    reset,
  };
};
