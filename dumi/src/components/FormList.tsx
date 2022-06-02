import React, { useMemo } from 'react';
import { Table } from 'antd';
import { FormItem, defineComponent, Column } from '@hanyk/general-form';
import { ColumnType } from 'antd/lib/table';
import { ComponentMap } from '.';
type Props = {
  columns: Array<
    ColumnType<any> & {
      formItem: Column<ComponentMap>;
    }
  >;
};

export default defineComponent<Props>((props) => {
  const columns = useMemo<ColumnType<any>[]>(() => {
    return (props.columns || []).map((column, key) => {
      return {
        ...column,
        render: (_, row, index) => {
          return (
            <FormItem
              {...column.formItem}
              index={index}
              tableField={props.context?.field}
              context={{
                getValues: () => row,
                subscribe: (list: any[], callBack: any) => {
                  return props.context?.subscribe(
                    list.map(
                      (key) => `${props.context?.field}[${index}][${key}]`,
                    ),
                    callBack,
                  );
                },
              }}
              field={
                column.dataIndex
                  ? `${props.context?.field}[${index}][${column.dataIndex}]`
                  : column.formItem.field
              }
            />
          );
        },
      };
    });
  }, [props]);

  return (
    <Table
      dataSource={props.value}
      columns={columns}
      pagination={false}
      footer={() => {
        return (
          <div
            style={{ textAlign: 'center' }}
            onClick={() => {
              if (!props.context?.field) return;
              const d = props.value || [];
              props.onChange?.([...d, {}]);
            }}
          >
            添加一行
          </div>
        );
      }}
    />
  );
});
