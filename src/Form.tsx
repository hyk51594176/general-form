import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import Context from './Context';
import FormItem from './FormItem';
import './index.css';
import { FormProps, FormRef } from './interface';
import { useDeepEqualEffect } from './useDeepEqualEffect';
import Store from './Store';
const Form = React.forwardRef<FormRef, PropsWithChildren<FormProps>>((props, ref) => {
  const { columns = [], notLayout, style, defaultData, className, children, form, ...rest } = props;

  const store = useRef<Store>(new Store(defaultData));

  const getRefFn = useCallback(() => store.current,[]);
  useImperativeHandle(ref, getRefFn);
  useDeepEqualEffect(() => {
    store.current.setValues(defaultData);
  }, [defaultData]);
  const {
    labelAlign = 'right',
    labelWidth = '80px',
    span,
    size,
    lg,
    md,
    sm,
    minItemWidth,
    disabled,
    offset,
  } = rest;
  useEffect(() => {
    store.current.setOptions(rest);
  }, [props]);

  useEffect(() => {
    if (form) {
      const { options, formData, itemInstances, eventList } = store.current;
      form.options = options;
      form.formData = formData;
      form.itemInstances = itemInstances;
      form.eventList = eventList;
      store.current = form;
    }
  }, [form]);

  const value = useMemo(() => {
    return {
      ...getRefFn(),
      labelAlign,
      labelWidth,
      span,
      size,
      lg,
      md,
      sm,
      minItemWidth,
      disabled,
      offset,
    };
  }, [disabled, getRefFn, labelAlign, labelWidth, lg, md, minItemWidth, offset, size, sm, span]);
  return (
    <Context.Provider value={value}>
      <div className={`hyk-form ${notLayout ? 'hyk-form-table' : ''} ${className}`} style={style}>
        {columns.map((obj, index) => (
          <FormItem key={obj.field || String(index)} {...obj} />
        ))}
        {children}
      </div>
    </Context.Provider>
  );
});

export default Form;
