import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import Context from './Context'
import { OBJ, Rpor } from './interface'
import Store from './Store'

type State<T, D> = [T, D]

export const useForm = <T extends OBJ = OBJ>(data?: T) => {
  return useMemo(() => new Store<T>(data), [])
}
type CallBack<T, D> = (state: State<T, D>) => void

export const useFormInstance = () => useContext(Context)
export const useWatch = <T = unknown, D = any>(
  field: string | string[],
  outForm?: Store | Rpor<any>,
  callBack?: CallBack<T, D>
) => {
  const inform = useFormInstance()
  const form = outForm ?? inform
  const data = form.formData

  const [state, setState] = useState<State<T, typeof data>>(
    Array.isArray(field)
      ? [field.map((k) => form.getValue(k)), form?.getValues()]
      : [form.getValue(field), form?.getValues()]
  )
  useLayoutEffect(() => {
    const isArr = Array.isArray(field)
    const list = isArr ? field : [field]
    return form?.subscribe<T>(list, (_field, { value, newValueList, row }) => {
      const val: State<T, D> = [(isArr ? newValueList : value) as any, row]
      setState(val)
      callBack?.(val)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])
  return state
}
