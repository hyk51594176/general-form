import React, { useEffect, useState, useCallback } from 'react';
import { Select } from 'antd';
import { RenderProps } from '@hanyk/general-form';
type ResData = Array<{ label: string; value: number }>;

interface HotSelectProps {
  getList: (params: any) => Promise<ResData>;
  params?: {
    [k: string]: string | number | boolean | undefined;
  };
}
const HotSelect: React.FC<Partial<RenderProps> & HotSelectProps> = (props) => {
  const [options, setOptions] = useState<ResData>([]);
  const getData = useCallback(async (data: any = {}) => {
    const params = Object.entries(props.params || {}).reduce(
      (item, [key, value]) => {
        return {
          ...item,
          [key]: data[value as string] || value,
        };
      },
      {} as any,
    );
    const res = await props.getList(params);
    setOptions(res);
  }, []);
  useEffect(() => {
    getData(props.getValues?.());
    const list = Object.values(props.params || {}) as string[];
    if (list.length && props.field) {
      const unSubscribe = props.subscribe?.(list, (_, __, data) => {
        props.onChange?.(undefined);
        getData(data);
      });
      return () => {
        unSubscribe?.();
      };
    }
  }, []);

  return (
    <Select
      options={options}
      value={props.value}
      onChange={props.onChange}
      style={{ width: '100%' }}
    />
  );
};

export default HotSelect;
