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
                ...props.context,
                getValues: () => {
                  return props.context?.getValue(
                    props.context?.field as string,
                  )[index];
                },
                subscribe: (list: any[], callBack: any) => {
                  props.context?.subscribe(
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
              if (!props.context?.field) return;
              const d = props.context?.getValue?.(props.context?.field) || [];
              d.push({});
              props.context?.setValue?.(props.context?.field, [...d]);
            }}
          >
            添加一行
          </div>
        );
      }}
    />
  );
});
