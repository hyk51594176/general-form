import { registerComponent } from '@hanyk/general-form';
import { Input, Radio, Button, DatePicker } from 'antd';
import HotSelect from './HotSelect';
import SubmitBtn from './SubmitBtn';
import AddandDel from './AddandDel';
import HeightBtn from './HeightBtn';
import FormList from './FormList';
import TableBtn from './TableBtn';
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
  FormList,
  TableBtn,
};
registerComponent(components);
export type ComponentMap = typeof components;
