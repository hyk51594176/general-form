import React, { ComponentProps } from 'react'
import { registerComponent, withDynamicData } from '@hanyk/general-form'
import { Input, Radio, Button, DatePicker, Select, InputNumber } from 'antd'
import SubmitBtn from './SubmitBtn'
import AddandDel from './AddandDel'
import HeightBtn from './HeightBtn'
import FormList from './FormList'
import TableBtn from './TableBtn'

export const HotSelect = withDynamicData<ComponentProps<typeof Select>>(
  (props) => <Select {...props} style={{ width: '100%' }} />
)
const RadioGroup = Radio.Group

const components = {
  Input,
  Select,
  RadioGroup,
  HotSelect,
  DatePicker,
  Button,
  SubmitBtn,
  InputNumber,
  AddandDel,
  HeightBtn,
  FormList,
  TableBtn
}
registerComponent(components)
export type ComponentMap = typeof components
