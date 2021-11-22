import React, { useMemo } from 'react';
import { Table } from 'antd';
import { FormItem, defineComponent, Column } from '@hanyk/general-form';
import { ColumnType } from 'antd/lib/table';
import { ComponentMap } from '.';
type Props = {
  columns: Array<
    ColumnType<any> & {
      formItem: Array<Column<ComponentMap>>;
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
              whitContext
              index={index}
              getValues={() => props.getValue?.(props.field as string)[index]}
              subscribe={(list: any[], callBack: any) => {
                props.subscribe?.(
                  list.map((key) => `${props.field}[${index}][${key}]`),
                  callBack,
                );
              }}
              field={
                column.dataIndex
                  ? `${props.field}[${index}][${column.dataIndex}]`
                  : undefined
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
              if (!props.field) return;
              const d = props.getValue?.(props.field) || [];
              d.push({});
              props.setValue?.(props.field, [...d]);
            }}
          >
            添加一行
          </div>
        );
      }}
    />
  );
});
