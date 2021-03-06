/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Context, ExcludeProps } from './interface';

export const ContextType = {
  size: PropTypes.string,
  span: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  labelWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minItemWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  labelAlign: PropTypes.string,
  onFiledChange: PropTypes.func,
  onLifeCycle: PropTypes.func,
  subscribe: PropTypes.func,
  getValue: PropTypes.func,
  getValues: PropTypes.func,
  setValue: PropTypes.func,
  setValues: PropTypes.func,
  validate: PropTypes.func,
  xs: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  sm: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  md: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  lg: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
  xl: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
};
// eslint-disable-next-line import/prefer-default-export
export function withFormContext<T extends Context>(
  Component: React.ComponentClass<T>,
) {
  const NewComponent: React.FC<ExcludeProps<T>> = (
    prop: ExcludeProps<T>,
    context: Context,
  ) => {
    const props = {
      ...context,
      ...prop,
    } as T;
    return <Component {...props} />;
  };
  NewComponent.contextTypes = ContextType;
  return NewComponent;
}
