import React, { useEffect, useState, useCallback } from 'react';
import { Select } from 'antd';
import { defineComponent } from '@hanyk/general-form';
type ResData = Array<{ label: string; value: number }>;
interface HotSelectProps {
  value?: any;
  getList: (params: any) => Promise<ResData>;
  params?: {
    [k: string]: string | number | boolean | undefined;
  };
}

export default defineComponent<HotSelectProps>((props) => {
  const [options, setOptions] = useState<ResData>([]);
  const getData = useCallback(
    (data: any = {}) => {
      const params = Object.entries(props.params || {}).reduce(
        (item, [key, value]) => {
          return {
            ...item,
            [key]: typeof value === 'string' ? data[value] || value : value,
          };
        },
        {} as any,
      );
      console.log('props: ', props);
      props.getList(params).then((res) => {
        setOptions(res);
      });
    },
    [props],
  );
  useEffect(() => {
    getData(props.getValues?.());
    const list = Object.values(props.params || {}) as string[];
    let unSubscribe!: Function | undefined;
    if (list.length && props.field) {
      unSubscribe = props.subscribe?.(list, () => {
        props.onChange?.(undefined);
        getData(props.getValues?.());
      });
    }
    return () => {
      unSubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.field]);

  return (
    <Select
      options={options}
      value={props.value}
      onChange={props.onChange}
      style={{ width: '100%' }}
    />
  );
});
