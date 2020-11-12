/*
 * @Author: 韩玉凯
 * @Date: 2020-07-04 23:01:47
 * @LastEditors: 韩玉凯
 * @LastEditTime: 2020-08-03 17:34:27
 * @FilePath: /mcommon/src/utils.ts
 */

import React from 'react';

interface Comp {
  [key: string]: React.FC | React.ComponentClass
}
export const components: Comp = {};

export const registerComponent = (obj: Comp) => {
  Object.assign(components, obj);
};
export const _toString = Object.prototype.toString;
export const getType = (obj: unknown) => {
  return _toString.call(obj).slice(8, -1);
};
export const isDiff = (o1: any, o2: any, key?: any): boolean => {
  if (o1 === o2) return false;
  if (getType(o1) !== getType(o2)) return true;
  if (o1 === null || o2 === null) return true;
  if (getType(o1) === 'Array') {
    if (o1.length !== o2.length) return true;
    return o1.some((item: any, index: any) => isDiff(item, o2[index], key));
  }
  if (getType(o1) === 'Object') {
    return key
      ? o1[key] !== o2[key]
      : Object.keys(o1).some((k) => isDiff(o1[k], o2[k], key));
  }
  if (getType(o1) === 'Date') return o1.getTime() !== o2.getTime();
  return true;
};
