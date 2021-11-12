# @hanyk/general-form

```bash
  npm install @hanyk/general-form
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

## API

### Form

#### props

| 属性          | 说明                                           | 类型                                              | 默认值 |
| ------------- | ---------------------------------------------- | ------------------------------------------------- | ------ |
| columns       | formItem 用到的 props                          | formItem[]                                        | []     |
| className     | css 类名                                       | string                                            |        |
| style         | style 样式                                     | CSSProperties                                     |        |
| span          | 透传 formItem                                  | number                                            |
| size          |                                                | string                                            |        |
| offset        | 透传 formItem                                  | number                                            |        |
| xs            | <768px 响应式栅格数或者栅格属性对象            | number/object (例如： {span: 4, offset: 4})       |        |
| sm            | ≥768px 响应式栅格数或者栅格属性对象            | number/object (例如： {span: 4, offset: 4})       |        |
| md            | ≥992px 响应式栅格数或者栅格属性对象            | number/object (例如： {span: 4, offset: 4})       |        |
| lg            | ≥1200px 响应式栅格数或者栅格属性对象           | number/object (例如： {span: 4, offset: 4})       |        |
| xl            | ≥1920px 响应式栅格数或者栅格属性对象           | number/object (例如： {span: 4, offset: 4})       |        |
| labelAligin   | 透传 formItem                                  | string                                            | right  |
| labelWidth    | 透传 formItem                                  | string                                            | 80px   |
| mintItemWidth | 透传 formItem                                  | string                                            |
| defaultData   | 要绑定数据对象                                 | object / array                                    |
| isNullClear   | 当 formitem 销毁的时候是否清除所绑定的字段的值 | boolean                                           | false  |
| notLayout     | 是否禁用布局，表格的时候建议开启               | boolean                                           | false  |
| onChange      | 值变化的 change 事件                           | object {field:'xxx',value:'xxx',formData,e:event} |        |

#### form 实例方法

| 方法名        | 说明                                      | 入参                                              | 返回值             |
| ------------- | ----------------------------------------- | ------------------------------------------------- | ------------------ |
| subscribe     | 订阅某个字段值的变化                      | fields: string[], callback:(field,value,formData) | 返回取消订阅的函数 |
| setValue      | 设置某个字段的值                          | field:string, value:any                           | 无                 |
| getValue      | 获取某个字段的值                          | field:string                                      | value:any          |
| setValues     | 设置某些字段的值                          | object:any                                        | 无                 |
| getValues     | 获取 form 的数据                          | object:any                                        | 无                 |
| resetFields   | 重置表单数据为默认值 defaultData 清除验证 | Object                                            | 无                 |
| clearValidate | 清楚表单验证                              | fields?: string[] 不传默认清除所有                | 无                 |
| validate      | 表单验证                                  | fields?: string[] 不传默认验证所有字段            | promise            |

### FormIte

| 属性          | 说明                                   | 类型                                                                    | 默认值 |
| ------------- | -------------------------------------- | ----------------------------------------------------------------------- | ------ |
| label         | 中文名字                               | string                                                                  |        |
| field         | 要绑定的字段 key                       | string                                                                  |        |
| itemClassName | css 类名                               | string                                                                  |        |
| itemStyle     | style 样式                             | CSSProperties                                                           |        |
| required      | 是否必填                               | boolean                                                                 | false  |
| rules         | 验证规则                               | Rule                                                                    |        |
| errorMsg      | 错误信息                               | string                                                                  |        |
| onChange      | 值改变的事件                           | (value: any, ...args: any[]) => void                                    |        |
| el/children   | 要渲染的组件类型                       | string\ReactNode\renderProps 字符串 需要通过 registerComponent 注册组件 |        |
| size          |                                        | string                                                                  |        |
| span          | 24 栅格布局                            | number                                                                  |        |
| offset        | 24 栅格布局                            | number                                                                  |        |
| xs            | <768px 响应式栅格数或者栅格属性对象    | number/object (例如： {span: 4, offset: 4})                             |        |
| sm            | ≥768px 响应式栅格数或者栅格属性对象    | number/object (例如： {span: 4, offset: 4})                             |        |
| md            | ≥992px 响应式栅格数或者栅格属性对象    | number/object (例如： {span: 4, offset: 4})                             |        |
| lg            | ≥1200px 响应式栅格数或者栅格属性对象   | number/object (例如： {span: 4, offset: 4})                             |        |
| xl            | ≥1920px 响应式栅格数或者栅格属性对象   | number/object (例如： {span: 4, offset: 4})                             |        |
| labelAlign    | label 对其方式                         | string                                                                  | right  |
| labelWidth    | label 的宽度                           | string                                                                  | 80px   |
| mintItemWidth | formItem 最小宽度 超出换行             | string                                                                  |        |
| ...           | el 所对应的组件需要的 props 都可以透传 | any                                                                     |        |

#### Rules

```js
{
  rules: [{ required: true }]
}
```

#### 多个 rule

```js
{
  rules: [
    { required: true, trigger: 'onBlur' },
    { pattern: /abcd/, message: 'abcd不能缺' },
    {
      validator: (rule, value, callback) => {
        callback('出错了')
      }
    }
  ]
}
```

| 参数       | 说明                                                                                                                     | 类型                            | 可选值            | 默认值   |
| :--------- | :----------------------------------------------------------------------------------------------------------------------- | :------------------------------ | :---------------- | :------- |
| required   | 不能为空                                                                                                                 | Boolean                         | true              |          |
| message    | 出错时候信息                                                                                                             | String                          |                   |          |
| type       | 被校验数据类型(注意 type:‘number’ 表示数据类型为 Number,而不是字符串形式的数字,字符串形式的数字请用 pattern:/^[0-9]\*$/) | String String/Array/url/email/… | String            |          |
| pattern    | 校验正则表达式 正则表达式（例如：/^[0-9]\*$/表示字符串形式的 number）                                                    |                                 |                   |          |
| len        | 长度校验，如果 max、mix 混合配置，len 的优先级最高                                                                       | Number                          |                   |          |
| min        | 字符最小长度                                                                                                             | Number                          |                   |          |
| max        | 字符最大长度                                                                                                             | Number                          |                   |          |
| whitespace | 是否进行空白字 符校验（true 进行校验)                                                                                    | Boolean                         |                   |          |
| validator  | 自定义校验,(校验成功的时候不要忘记执行 callback(),否则会校验不返回)                                                      | Function(rule,value,callback)   |                   |          |
| trigger    | 触发校验的事件名称                                                                                                       | String/Array                    | onChange/onBlur/… | onChange |
