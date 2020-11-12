# @hanyk/general-form

```bash
  npm install @hanyk/general-form --save
```

## 示例

```jsx
import React from 'react'
import { Input, Button, Select } from 'antd'
import { Form, FormItem, registerComponent } from '@hanyk/general-form'
registerComponent({ Input, Select })

const data = { a: '1', b: 2, c: 3, d: 4, e: 5 }
export default class App extends React.Component {
  state = {
    required: false,
    formData: data,
    event: undefined
  }
  fomEl!: Form | null

  get rules() {
    return { required: this.state.required, message: '该字段不能为空' }
  }
  get columns() {
    return [
      {
        el: <Input />,
        field: 'a',
        label: 'a',
        rules: this.rules
      },
      {
        el: 'Select',
        field: 'b',
        label: 'b',
        hasClear: true,
        showSearch: true,
        dataSource: [
          { label: '山东', value: 1 },
          { label: '浙江', value: 2 }
        ],
        rules: this.rules
      }
    ]
  }
  render() {
    const { required, event, formData } = this.state
    const rules = this.rules
    return (
      <Form
        isArray
        columns={this.columns}
        defaultData={data}
        labelWidth="80px"
        span={6}
        ref={(e) => {
          this.fomEl = e
        }}
        onChange={({ field, value, formData }) => {
          this.setState({
            formData,
            event: { field, value, formData }
          })
        }}
      >
        {required && (
          <FormItem label="d" field="d">
            <Input />
          </FormItem>
        )}

        <FormItem field="e" rules={rules} label="e">
          {(props: any) => {
            return <Input {...props} />
          }}
        </FormItem>

        <FormItem label="" span={24}>
          <Button
            type="primary"
            onClick={() => {
              this.setState({ required: !required })
            }}
          >
            设置非必填和展示 {required}
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl.setValues({ a: '1', b: 2, c: 3, d: 4 })
              }
            }}
          >
            setValues
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                console.log('getValue(a)', this.fomEl.getValue('a'))
              }
            }}
          >
            getValue('a')
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.setState({ formData: this.fomEl.getValues() })
              }
            }}
          >
            getValues()
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl.clearValidate()
              }
            }}
          >
            clearValidate
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl.resetFields()
                this.setState({ formData: this.fomEl.getValues() })
              }
            }}
          >
            resetFields
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl
                  .validate()
                  .then((values: any) => {
                    console.log('验证成功', values)
                  })
                  .catch((args: any) => {
                    console.log('验证失败', args)
                  })
              }
            }}
          >
            验证
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl.setValues([])
                this.fomEl.clearValidate()
              }
            }}
          >
            清空
          </Button>
        </FormItem>
        <div>
          原始数据
          {JSON.stringify(data)}
          <br />
          表单数据 {JSON.stringify(formData)}
          <br />
          表单onChange事件 {JSON.stringify(event)}
        </div>
      </Form>
    )
  }
}

```

```jsx

import React from 'react'
import { Input, Button } from 'antd'
import { Form, FormItem, registerComponent } from '@hanyk/general-form'
registerComponent({ Input })

const data = [
  { a: '1', b: 2, c: 3, d: 4 },
  { a: 1, b: 2, c: 3, d: 4 },
  { a: 1, b: 2, c: 3, d: 4 }
]
export default class App extends React.Component {
  state = {
    required: false,
    formData: data,
    event: undefined
  }
  fomEl!: Form | null

  get rules() {
    return { required: this.state.required, message: '该字段不能为空' }
  }
  get columns() {
    return [
      {
        el: 'Input',
        field: '[0].a',
        label: '0a',
        rules: this.rules
      },
      {
        el: 'Input',
        field: '[1].a',
        label: '1a',
        rules: this.rules
      },
      {
        el: 'Input',
        field: '[2].a',
        label: '2a',
        rules: this.rules
      }
    ]
  }
  render() {
    const { required, event, formData } = this.state
    const rules = this.rules
    return (
      <Form
        isArray
        columns={this.columns}
        defaultData={data}
        span={6}
        ref={(e) => {
          this.fomEl = e
        }}
        onChange={({ field, value, formData }) => {
          this.setState({
            formData,
            event: { field, value, formData }
          })
        }}
      >
        {required && (
          <FormItem label="0b" field="[0].b">
            <Input />
          </FormItem>
        )}
        <FormItem field="[0].c" rules={rules} label="0c">
          {(props: any) => {
            return <Input {...props} />
          }}
        </FormItem>
        <FormItem label="" span={24}>
          <Button
            type="primary"
            onClick={() => {
              this.setState({ required: !required })
            }}
          >
            设置非必填和展示 {required}
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl.setValues([{ a: '1', b: 2, c: 3, d: 4 }])
              }
            }}
          >
            setValues
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                console.log('getValue([0].a)', this.fomEl.getValue('[0].a'))
              }
            }}
          >
            getValue('[0].a')
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.setState({ formData: this.fomEl.getValues() })
              }
            }}
          >
            getValues()
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl.clearValidate()
              }
            }}
          >
            clearValidate
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl.resetFields()
                this.setState({ formData: this.fomEl.getValues() })
              }
            }}
          >
            resetFields
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl
                  .validate()
                  .then((values: any) => {
                    console.log('验证成功', values)
                  })
                  .catch((args: any) => {
                    console.log('验证失败', args)
                  })
              }
            }}
          >
            验证
          </Button>
          &nbsp;
          <Button
            type="primary"
            onClick={() => {
              if (this.fomEl) {
                this.fomEl.setValues([])
                this.fomEl.clearValidate()
              }
            }}
          >
            清空
          </Button>
        </FormItem>
        <div>
          原始数据
          {JSON.stringify(data)}
          <br />
          表单数据 {JSON.stringify(formData)}
          <br />
          表单onChange事件 {JSON.stringify(event)}
        </div>
      </Form>
    )
  }
}


```

## 布局

* xs <768px 响应式栅格数或者栅格属性对象 number/object (例如： {span: 4, offset: 4})
* md ≥992px 响应式栅格数或者栅格属性对象 number/object (例如： {span: 4, offset: 4})
* sm ≥768px 响应式栅格数或者栅格属性对象 number/object (例如： {span: 4, offset: 4})
* lg ≥1200px 响应式栅格数或者栅格属性对象 number/object (例如： {span: 4, offset: 4})
* xl ≥1920px 响应式栅格数或者栅格属性对象 number/object (例如： {span: 4, offset: 4})
