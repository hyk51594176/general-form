import React, { useEffect, useState, useCallback } from 'react';
import { Select } from 'antd';
import { RenderProps } from '@hanyk/general-form';
type ResData = Array<{ label: string; value: number }>;

interface HotSelectProps {
  value?: any;
  getList: (params: any) => Promise<ResData>;
  params?: {
    [k: string]: string | number | boolean | undefined;
  };
}
const HotSelect: React.FC<RenderProps & HotSelectProps> = (props) => {
  const [options, setOptions] = useState<ResData>([]);
  const getData = useCallback(
    (data: any = {}) => {
      const params = Object.entries(props.params || {}).reduce(
        (item, [key, value]) => {
          return {
            ...item,
            [key]:
              typeof value === 'string'
                ? props.getValues?.()[value] || value
                : value,
          };
        },
        {} as any,
      );
      props.getList(params).then((res) => {
        setOptions(res);
      });
    },
    [props],
  );
  useEffect(() => {
    getData(props.getValues?.());
    const list = Object.values(props.params || {}) as string[];
    if (list.length && props.field) {
      const unSubscribe = props.subscribe?.(list, () => {
        props.onChange?.(undefined);
        getData();
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
