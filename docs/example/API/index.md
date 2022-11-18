---
nav:
  title: 使用文档
  path: /docs
---

## 开始

### 安装

```bash
npm i @hanyk/general-form
```

## API

### Form

#### props

| 属性          | 说明                                  | 类型                                                | 默认值 |
| ------------- | ------------------------------------- | --------------------------------------------------- | ------ |
| columns       | formItem 用到的 props                 | formItem[]                                          | []     |
| className     | css 类名                              | string                                              |        |
| style         | style 样式                            | CSSProperties                                       |        |
| span          | 透传 formItem                         | number                                              |        |
| size          |                                       | string                                              |        |
| offset        | 透传 formItem                         | number                                              |        |
| xs            | <768px 响应式栅格数或者栅格属性对象   | number/object(例如：{span:4, offset:4})             |        |
| sm            | ≥768px 响应式栅格数或者栅格属性对象  | number/object(例如：{span:4, offset:4})             |        |
| md            | ≥992px 响应式栅格数或者栅格属性对象  | number/object(例如：{span:4, offset:4})             |        |
| lg            | ≥1200px 响应式栅格数或者栅格属性对象 | number/object(例如：{span:4, offset:4})             |        |
| xl            | ≥1920px 响应式栅格数或者栅格属性对象 | number/object(例如：{span:4, offset:4})             |        |
| labelAligin   | 透传 formItem                         | string                                              | right  |
| labelWidth    | 透传 formItem                         | string                                              | 80px   |
| mintItemWidth | 透传 formItem                         | string                                              |        |
| defaultData   | 要绑定数据对象                        | object/array                                        |        |
| notLayout     | 是否禁用布局，表格的时候建议开启      | boolean                                             | false  |
| onChange      | 值变化的 change 事件                  | object{field:'xxx', value:'xxx', formData, e:event} |        |
| disabled      | 全局禁止编辑                          | boolean                                             |        |
| submitShow    | 仅显示时提交                          | boolean                                             |   true   |

#### form 实例方法

| 方法名        | 说明                                      | 入参                                               | 返回值             |
| ------------- | ----------------------------------------- | -------------------------------------------------- | ------------------ |
| subscribe     | 订阅某个字段值的变化                      | fields:string[], callback:(field, value, formData) | 返回取消订阅的函数 |
| setValue      | 设置某个字段的值                          | field:string, value:any                            | 无                 |
| getValue      | 获取某个字段的值                          | field:string                                       | value:any          |
| setValues     | 设置某些字段的值                          | object:any                                         | 无                 |
| getValues     | 获取 form 的数据                          | object:any                                         | 无                 |
| resetFields   | 重置表单数据为默认值 defaultData 清除验证 | Object                                             | 无                 |
| clearValidate | 清楚表单验证                              | fields?:string[]不传默认清除所有                   | 无                 |
| validate      | 表单验证                                  | fields?:string[]不传默认验证所有字段               | promise            |

### FormIte

| 属性                       | 说明                                          | 类型                                                                   | 默认值 |
| -------------------------- | --------------------------------------------- | ---------------------------------------------------------------------- | ------ |
| label                      | 中文名字                                      | string                                                                 |        |
| field                      | 要绑定的字段 key 支持多级'a.b.c'、'a[0][0].b' | string                                                                 |        |
| itemClassName              | css 类名                                      | string                                                                 |        |
| itemStyle                  | style 样式                                    | CSSProperties                                                          |        |
| required                   | 是否必填                                      | boolean                                                                | false  |
| rules                      | 验证规则                                      | Rule                                                                   |        |
| errorMsg                   | 错误信息                                      | string                                                                 |        |
| onChange                   | 值改变的事件                                  | (value:any, ...args:any[])=>void                                       |        |
| el/children                | 要渲染的组件类型                              | string\ReactNode\renderProps 字符串需要通过 registerComponent 注册组件 |        |
| size                       | 透传输入组件                                  | string                                                                 |        |
| span                       | 24 栅格布局                                   | number                                                                 |        |
| offset                     | 24 栅格布局                                   | number                                                                 |        |
| xs                         | <768px 响应式栅格数或者栅格属性对象           | number/object(例如：{span:4, offset:4})                                |        |
| sm                         | ≥768px 响应式栅格数或者栅格属性对象          | number/object(例如：{span:4, offset:4})                                |        |
| md                         | ≥992px 响应式栅格数或者栅格属性对象          | number/object(例如：{span:4, offset:4})                                |        |
| lg                         | ≥1200px 响应式栅格数或者栅格属性对象         | number/object(例如：{span:4, offset:4})                                |        |
| xl                         | ≥1920px 响应式栅格数或者栅格属性对象         | number/object(例如：{span:4, offset:4})                                |        |
| labelAlign                 | label 对其方式                                | string                                                                 | right  |
| labelWidth                 | label 的宽度                                  | string                                                                 | 80px   |
| mintItemWidth              | formItem 最小宽度超出换行                     | string                                                                 |        |
| mintItemWidth              | formItem 最小宽度超出换行                     | string                                                                 |        |
| content                    | el对应的children                              | ReactNode                                                              |        |
| isShow                     | 是否展示                                      | boolean/DynamicParameter                                               |        |
| context                    | 覆盖context                                   |                                                                        |        |
| 其他所有额属性透传输入组件 | el 所对应的组件需要的 props 都可以透传        | any                                                                    |        |

#### DynamicParameter

| 属性     | 说明                               | 类型                        | 默认值 |
| -------- | ---------------------------------- | --------------------------- | ------ |
| relyOn   | 依赖                               | Object {[k: string]: any[] \| ((value: any, context: Rpor<any>) => boolean)} |        |
| relation | relyOn 有多个 key 时来确定逻辑关系 | 'and' 、 'or'               | 'or'   |
| notIn    | 是否取反                           | boolean                     | false  |

```ts
export type DynamicParameter = {
  relation?: 'and' | 'or'
  notIn?: boolean
  relyOn: {
    [k: string]: any[] | ((value: any, context: Rpor<any>) => boolean)
  },
  external?: boolean
}

```

#### Rules

```js
{
    rules: [{
        required: true,
    }, ];
}
```

#### 多个 rule

```js
{
    rules: [{
            required: true,
            trigger: 'onBlur',
        },
        {
            pattern: /abcd/,
            message: 'abcd不能缺',
        },
        {
            validator: (rule, value, callback) => {
                callback('出错了');
            },
        },
    ];
}
```

| 参数       | 说明                                                                                                                        | 类型                            | 可选值             | 默认值   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------ | -------- |
| required   | 不能为空                                                                                                                    | Boolean                         | true               |          |
| message    | 出错时候信息                                                                                                                | String                          |                    |          |
| type       | 被校验数据类型(注意 type:‘number’表示数据类型为 Number, 而不是字符串形式的数字, 字符串形式的数字请用 pattern:/^[0-9]\*$/) | StringString/Array/url/email/… | String             |          |
| pattern    | 校验正则表达式正则表达式（例如：/^[0-9]\*$/表示字符串形式的 number）                                                        |                                 |                    |          |
| len        | 长度校验，如果 max、mix 混合配置，len 的优先级最高                                                                          | Number                          |                    |          |
| min        | 字符最小长度                                                                                                                | Number                          |                    |          |
| max        | 字符最大长度                                                                                                                | Number                          |                    |          |
| whitespace | 是否进行空白字符校验（true 进行校验)                                                                                        | Boolean                         |                    |          |
| validator  | 自定义校验, (校验成功的时候不要忘记执行 callback(), 否则会校验不返回)                                                       | Function(rule, value, callback) |                    |          |
| trigger    | 触发校验的事件名称                                                                                                          | String/Array                    | onChange/onBlur/… | onChange |

#### hooks

##### useForm

2.3.0 新增，
 创建 Form 实例，用于管理所有数据状态。

##### useFormInstance

2.3.0 新增，
```tsx | pure
import React from 'react'
import { useFormInstance, useForm } from '@hanyk/general-form'; 

const Sub = () => {
  const form = useFormInstance(); 

  return <Button onClick={() => form.setValues({})} />; 
}; 

export default () => {
  const form = useForm(); 

  return (

    <Form form={form}>
      <Sub />
    </Form>

  ); 
}; 

```

#### useWatch

2.3.0 新增，用于直接获取 form 中字段对应的值。通过该 Hooks 可以触发当前组件的更新

```tsx | pure
import { useWatch, useForm,FormItem,Form } from '@hanyk/general-form'; 

const Demo = () => {
  const form = Form.useForm();
  const [value,oldValue,formData] = useWatch('username', form);
  useWatch(['username']); // 当位数数组的时候可以监听多个，无返回值，通过form.getValues 获取值
  return (
    <Form form={form}>
      <FormItem name="username">
        <Select options={[]} />
      </FormItem>
    </Form>
  );
};
```
