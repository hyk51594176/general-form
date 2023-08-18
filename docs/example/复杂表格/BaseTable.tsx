/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import { Button, Table, TableProps } from 'antd'
import {
  FormItem,
  FormItemProps,
  useFormInstance,
  useWatch
} from '@hanyk/general-form'
import React, { useMemo, isValidElement, ReactElement } from 'react'
import { ColumnType } from 'antd/es/table'

type P<T> = {
  record: T
  index: number
  value: any
  isRoot?: boolean
  dataIndex?: string
  field: string
}
export type FormatProps<T = any> = (
  params: P<T>
) => FormItemProps | ReactElement
const _createRender = (key: string, fn: FormatProps, dataIndex?: string) => {
  if (!fn) return undefined
  return (value: any, record: any, index: number) => {
    const parentKey = `${key}[${index}]`
    const field = `${parentKey}.${dataIndex}`
    const params = fn({
      record,
      index,
      value,
      dataIndex,
      field
    })
    if (isValidElement(params)) return params
    return <FormItem itemStyle={{ padding: 0 }} field={field} {...params} />
  }
}

export type BaseTableProps<T = any> = {
  fieldKey: string
  createRender?: typeof _createRender
  columns?: Array<
    Omit<ColumnType<T>, 'render'> & {
      render: FormatProps<T>
    }
  >
  hiddenAddBtn?: boolean
} & Omit<TableProps<any>, 'columns'>

function BaseTable<T = any>({
  fieldKey = 'swaggerInfo.requestQueryParams',
  createRender = _createRender,
  columns,
  hiddenAddBtn,
  ...tableProps
}: BaseTableProps<T>) {
  const [dataSource = [{}]] = useWatch<any[]>(fieldKey, undefined, undefined, {
    deep: true
  })
  const form = useFormInstance()
  const tbColumns = useMemo(() => {
    return columns?.map((item) => {
      return {
        ...item,
        render: createRender(fieldKey, item?.render, item.dataIndex as string)
      }
    })
  }, [columns, createRender, fieldKey])
  return (
    <>
      <Table
        style={{ width: '100%' }}
        columns={tbColumns}
        className="dsc-interfaceDev-BodyTable"
        dataSource={dataSource}
        pagination={false}
        rowKey="id"
        {...tableProps}
      />
      {!hiddenAddBtn && (
        <Button
          block
          type="dashed"
          icon={<Button type="primary">添加</Button>}
          style={{ marginTop: 10 }}
          onClick={() => {
            const _dataSource = [...(tableProps?.dataSource || dataSource)]
            const arr = _dataSource ?? []
            arr.splice(_dataSource?.length, 0, {})
            form.setValue(fieldKey, arr)
          }}
        >
          创建
        </Button>
      )}
    </>
  )
}

export default BaseTable
