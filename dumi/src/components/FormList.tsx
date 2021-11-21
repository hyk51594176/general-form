import React, { useMemo } from 'react';
import { Table } from 'antd';
import { FormItem, RenderProps, Column } from '@hanyk/general-form';
import { ColumnType } from 'antd/lib/table';
type Props = RenderProps & {
  columns: Array<ColumnType<any> & { formItem: Column<any> }>;
};

const FormTable: React.FC<Props> = (props) => {
  const columns = useMemo<ColumnType<any>[]>(() => {
    return (props.columns || []).map((column, key) => {
      return {
        ...column,
        render: (_, row, index) => {
          if (!row.__id__) {
            row.__id__ = Date.now();
          }
          return (
            <FormItem
              {...column.formItem}
              whitContext
              key={row.__id__}
              getValues={() => row}
              subscribe={(list: any[], callBack: any) => {
                props.subscribe?.(
                  list.map((key) => `${props.field}[${index}][${key}]`),
                  callBack,
                );
              }}
              field={`${props.field}[${index}][${column.dataIndex}]`}
            />
          );
        },
      };
    });
  }, [props.value, props.field, props.subscribe]);

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
};

export default FormTable;
