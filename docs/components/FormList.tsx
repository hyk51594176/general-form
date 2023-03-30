import React, { useMemo } from 'react'
import { Table } from 'antd'
import { FormItem, defineComponent, FormItemProps } from '@hanyk/general-form'
import { ColumnType } from 'antd/es/table'
import { ComponentMap } from '.'

type Props = {
  columns: Array<
    ColumnType<any> & {
      formItem: FormItemProps<ComponentMap>
    }
  >
}

export default defineComponent<Props, any[]>((props) => {
  const columns = useMemo<ColumnType<any>[]>(() => {
    return (props.columns || []).map((column) => {
      return {
        ...column,
        render: (_, row, index) => {
          const field = column.dataIndex
            ? `${props.context?.field}[${index}][${column.dataIndex}]`
            : column.formItem.field
          return (
            <FormItem
              {...column.formItem}
              index={index}
              tableField={props.context?.field}
              context={{
                getValues: () =>
                  props.context?.getValue(props.context.field as string)[0],
                subscribe: (list: any[], callBack: any) => {
                  return props.context?.subscribe(
                    list.map(
                      (key) => `${props.context?.field}[${index}][${key}]`
                    ),
                    callBack
                  )
                }
              }}
              field={field}
            />
          )
        }
      }
    })
  }, [props])

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
              if (!props.context?.field) return
              const d = props.value || []
              props.onChange?.([...d, {}])
            }}
          >
            添加一行
          </div>
        )
      }}
    />
  )
})
