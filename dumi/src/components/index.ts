import { registerComponent } from '@hanyk/general-form';
import { Input, Radio, Button, DatePicker } from 'antd';
import HotSelect from './HotSelect';
import SubmitBtn from './SubmitBtn';
import AddandDel from './AddandDel';
import HeightBtn from './HeightBtn';
// import FormTable from './FormTable';
import '@hanyk/general-form/dist/index.css';

const RadioGroup = Radio.Group;
const components = {
  Input,
  RadioGroup,
  HotSelect,
  DatePicker,
  Button,
  SubmitBtn,
  AddandDel,
  HeightBtn,
  // FormTable,
};
registerComponent(components);
export type ComponentMap = typeof components;
