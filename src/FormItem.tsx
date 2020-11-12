import React from 'react';

import { components, isDiff } from './utils';

import { FormItemProps, UpdateType, DefaultItemProps } from './interface';

interface State {
  value: unknown
  errorMsg?: string
}
export default class FormItem extends React.Component<FormItemProps, State> {
  static defaultProps: DefaultItemProps = {
    onFiledChange() {},
    onLifeCycle() {},
    subscribe() {
      return () => {};
    },
    getValue() {},
    getValues() {
      return {};
    },
    setValue() {},
    setValues() {},
    validate() {
      return Promise.resolve({});
    },
  };

  constructor(props: FormItemProps) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue,
      errorMsg: props.errorMsg,
    };
  }

  componentDidMount() {
    const { field, onLifeCycle } = this.props;
    field && onLifeCycle(UpdateType.mount, field, this);
  }

  componentWillReceiveProps(nexProps: FormItemProps) {
    if (isDiff(nexProps.value, this.props.value)) {
      this.setState({ value: nexProps.value });
    }
    if (isDiff(this.props.errorMsg, nexProps.errorMsg)) {
      this.setErrorMsg(nexProps.errorMsg);
    }
  }

  componentWillUnmount() {
    const { field, onLifeCycle } = this.props;
    field && onLifeCycle(UpdateType.unmount, field, this);
  }

  get triggerType() {
    const { rules } = this.props;
    let triggerKey: string | undefined;
    if (!rules) return triggerKey;
    return (Array.isArray(rules) ? rules : [rules]).reduce(
      (str, { trigger }) => {
        if (trigger) str = trigger;
        return str;
      },
      'onChange',
    );
  }

  get required() {
    const { required, rules } = this.props;
    if (!rules) return required;
    if (Array.isArray(rules)) return rules.some((item) => item.required);
    return rules.required;
  }

  get children() {
    const {
      el,
      field,
      span,
      offset,
      label,
      labelWidth,
      minItemWidth,
      itemClassName,
      itemStyle,
      labelAlign,
      required,
      rules,
      errorMsg,
      onChange,
      children,
      onFiledChange,
      onLifeCycle,
      subscribe,
      getValue,
      getValues,
      setValue,
      setValues,
      validate,
      xs,
      sm,
      md,
      lg,
      xl,
      ...other
    } = this.props;
    const { value } = this.state;
    let child: any = children || el;
    if (child) {
      const props: any = {
        value,
        ...other,
        onChange: (val: any, ...args: any[]) => {
          this.onChange(val, ...args);
          if (typeof onChange === 'function') onChange(val, ...args);
        },
      };
      if (field && this.triggerType) {
        const fn = props[this.triggerType];
        props[this.triggerType] = (...args: any[]) => {
          typeof fn === 'function' && fn(...args);
          setTimeout(() => {
            validate([field]);
          }, 0);
        };
      }
      if (React.isValidElement<{}>(child)) {
        child = React.cloneElement(child, {
          ...child.props,
          ...props,
        });
      } else if (typeof child === 'function') {
        child = child({
          ...props,
          onFiledChange,
          onLifeCycle,
          subscribe,
          getValue,
          getValues,
          setValue,
          setValues,
          validate,
        });
      } else if (typeof child === 'string' && components[child]) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const Comp = components[child];
        return <Comp {...props} />;
      }
      return child;
    }
    return value;
  }

  setErrorMsg = (errorMsg?: string) => {
    this.setState({ errorMsg });
  };

  setValue = (value: any) => {
    this.setState({ value });
  };

  onChange = (e: any, ...args: any[]) => {
    const { field, onFiledChange } = this.props;
    let value!: any;
    try {
      value = e.target.value;
    } catch (error) {
      value = e;
    }
    this.setState({ value }, () => {
      if (!field) return;
      onFiledChange(field, { value, e, ...args });
    });
  };

  get computedClassName() {
    const { span, offset } = this.props;
    const str:string[] = [];
    if (span) {
      str.push(`col-${span}`);
    }
    if (offset) {
      str.push(`col-offset-${offset}`);
    }
    ['xs', 'sm', 'md', 'lg', 'xl'].forEach(key => {
      const o = this.props[key];
      if (!o) return;
      if (typeof o === 'object') {
        if (o.span) {
          str.push(`col-${key}-${o.span}`);
        }
        if (o.offset) {
          str.push(`col-${key}-offset-${o.offset}`);
        }
      } else {
        str.push(`col-${key}-${o}`);
      }
    });


    return str.join(' ');
  }

  render() {
    const {
      labelWidth,
      labelAlign,
      label,
      minItemWidth,
      itemClassName = '',
      itemStyle = {},
    } = this.props;
    const labelStyles = {
      width: labelWidth,
      textAlign: labelAlign,
    };
    const { errorMsg } = this.state;
    return (
      <div
        className={`hyk-form-item ${this.computedClassName} ${itemClassName}`}
        style={{ minWidth: minItemWidth, ...itemStyle }}
      >
        {label !== undefined && (
          <label
            title={ typeof label === 'string' ? label : ''}
            className={`hyk-form-item-label ${this.required ? 'required' : ''}`}
            style={labelStyles}
          >
            {label}
          </label>
        )}
        <div className="hyk-form-item-container">
          {this.children}
          <span className="hyk-form-item-error">{errorMsg}</span>
        </div>
      </div>
    );
  }
}
