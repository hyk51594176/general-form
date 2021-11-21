import React, { useMemo } from 'react';
import { Table } from 'antd';
import { FormItem, RenderProps, Column } from '@hanyk/general-form';
import { ColumnType } from 'antd/lib/table';
type Props = RenderProps & {
  columns: Array<ColumnType<any> & { formItem: Column<any> }>;
};

const FormTable: React.FC<Props> = (props) => {
  const columns = useMemo<ColumnType<any>[]>(() => {
    return (props.columns || []).map((column) => {
      return {
        ...column,
        render: (t, i) => {
          return (
            <FormItem
              {...column.formItem}
              index={i}
              field={`${props.field || ''}[${i}][${column.dataIndex}]`}
            />
          );
        },
      };
    });
  }, [props.columns]);

  return <Table dataSource={props.value} columns={columns} />;
};

export default FormTable;
