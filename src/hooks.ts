import { useContext, useEffect, useLayoutEffect, useMemo } from 'react';
import { useState } from 'react';
import Context from './Context';
import {  Rpor } from './interface'
import Store from './Store';


type State<T, D> = [T, T | undefined, D] | []


export const useForm = <T extends Object = {}>() => {
  return useMemo(() => new Store<T>(), [])
}

export const useWatch = <T = unknown>(field: string | string[], form: Store | Rpor<any>) => {
  const data = form.formData

  const [state, setState] = useState<State<T, typeof data>>(
    Array.isArray(field) ? [] : [form.getValue(field), undefined, form.getValues()]
  )
  useEffect(() => {
    setTimeout(() => {
      if (!Array.isArray(field)) {
        setState([form.getValue(field), undefined, form.getValues()])
      }
    }, 0);
    return form?.subscribe<T>(Array.isArray(field) ? field : [field], (field, { value, oldVal, row }) => {
      setState([value, oldVal, row])
    })
  }, [form, field])
  return state

}

export const useFormInstance = () => useContext(Context);