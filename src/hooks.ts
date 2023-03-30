import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import Context from './Context'
import { OBJ, Rpor } from './interface'
import Store from './Store'

type State<T, D> = [T, T | undefined, D, string] | []

export const useForm = <T extends OBJ = OBJ>(data?: T) => {
  return useMemo(() => new Store<T>(data), [])
}
type CallBack<T, D> = (state: State<T, D>) => void

export const useFormInstance = () => useContext(Context)
export const useWatch = <T = unknown, D extends OBJ = any>(
  field: string | string[],
  outForm?: Store | Rpor<any>,
  callBack?: CallBack<T, D>
) => {
  const inform = useFormInstance()
  const form = outForm ?? inform
  const data = form.formData

  const [state, setState] = useState<State<T, typeof data>>(
    Array.isArray(field)
      ? []
      : [form.getValue(field), undefined, form.getValues(), field]
  )
  useLayoutEffect(() => {
    return form?.subscribe<T>(
      Array.isArray(field) ? field : [field],
      (_field, { value, oldVal, row }) => {
        setState([value, oldVal, row, _field])
        callBack?.([value, oldVal, row, _field])
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])
  return state
}
