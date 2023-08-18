/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
import { FormItem, useFormInstance, useWatch } from '@hanyk/general-form'
import React, { isValidElement, useMemo } from 'react'
import { Button } from 'antd'
import FieldType from './FieldType'
import BaseTable, { BaseTableProps, FormatProps } from './BaseTable'

const rules = { required: true, message: '必填' }

const fieldKey = 'requestBody'

type Body = {
  name: string
  type: string
  exampleValue: string
  desc: string
  format: string
  children?: Body[]
  _key: string
  _parentKey: string
}

function RequestBody() {
  const form = useFormInstance()
  const [val = {} as Body] = useWatch<Body>(fieldKey, undefined, undefined, {
    deep: true
  })
  const dataSource = useMemo(() => {
    const list = [val]
    val._key = `${fieldKey}`
    const setObj = (item: Body) => {
      item.children?.forEach((obj, index) => {
        obj._key = `${item._key}.children[${index}]`
        obj._parentKey = item._key
        setObj(obj)
      })
    }
    val.children?.forEach((obj: Body, index: number) => {
      obj._key = `${fieldKey}.children[${index}]`
      obj._parentKey = val._key
      setObj(obj)
    })
    return list
  }, [val])

  const createRender = (key: string, fn: FormatProps, dataIndex?: string) => {
    return (value: any, record: Body, index: number) => {
      const { _key } = record
      const field = `${_key}.${dataIndex}`
      const obj = fn({
        record,
        index,
        value,
        field
      })
      if (isValidElement(obj)) return obj
      const props = {
        field,
        itemStyle: { padding: 0 },
        ...obj
      }
      return <FormItem {...props} />
    }
  }

  const columns: BaseTableProps<Body>['columns'] = [
    {
      title: '参数名',
      dataIndex: 'name',
      render: ({ field, record, value }) => {
        const parent = form.getValue(record._parentKey ?? record._key)
        const isArray = parent?.type === 'array'
        if (isArray && value) {
          form.onFiledChange(field, { value: undefined })
        }
        return {
          span: 16,
          rules: isArray || !record._parentKey ? undefined : rules,
          el: !record._parentKey ? 'root' : isArray ? <>item</> : 'Input'
        }
      }
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 250,
      render: ({ record }) => {
        const listKey = `${record._key}.children`
        return {
          el: <FieldType otherField="format" parentKey={record._key} />,
          onChange: (e) => {
            let value
            if (['object', 'array'].includes(e)) {
              const list = form.getValue(listKey)
              if (!list?.length) {
                value = [{}]
              } else if (e === 'array') {
                value = [list[0]]
              }
            }
            form.onFiledChange(listKey, { value })
          }
        }
      }
    },
    {
      title: '是否必填',
      dataIndex: 'required',
      render: () => {
        return {
          el: 'Switch'
        }
      }
    },
    {
      title: '示例值',
      dataIndex: 'exampleValue',
      render: ({ record, value }) => {
        if (value && ['object', 'array'].includes(record.type)) {
          form.onFiledChange(`${record._key}.exampleValue`, {
            value: undefined
          })
        }
        return {
          el: ['object', 'array'].includes(record.type) ? <>--</> : 'Input'
        }
      }
    },
    {
      title: '参数说明',
      dataIndex: 'desc',
      render: () => {
        return {
          el: 'Input'
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'cz',
      fixed: 'right',
      width: '150px',
      render: ({ record, index }) => {
        if (!record._parentKey) {
          return {}
        }
        const parent = form.getValue(record._parentKey)
        const listKey = `${record._parentKey}.children`
        return (
          <>
            {!['array'].includes(parent.type) && (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  const arr = form.getValue(listKey) ?? []
                  arr.splice(index + 1, 0, {})
                  form.onFiledChange(listKey, {
                    value: arr.length ? arr : undefined
                  })
                }}
              >
                添加
              </Button>
            )}
            &nbsp;
            {index !== 0 && ['object', 'array'].includes(parent.type) && (
              <Button
                size="small"
                type="default"
                onClick={() => {
                  const arr = form.getValue(listKey) ?? [record]
                  arr.splice(index, 1)
                  form.onFiledChange(listKey, {
                    value: arr.length ? arr : undefined
                  })
                }}
              >
                删除
              </Button>
            )}
          </>
        )
      }
    }
  ]

  return (
    <BaseTable
      fieldKey={fieldKey}
      style={{ width: '100%' }}
      columns={columns}
      createRender={createRender}
      dataSource={dataSource}
      pagination={false}
      hiddenAddBtn
      rowKey="_key"
      expandable={{
        defaultExpandAllRows: true,
        indentSize: 5
      }}
    />
  )
}

export default RequestBody
