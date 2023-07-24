import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import Context from './Context'
import { ContextProp, OBJ, Rpor } from './interface'
import Store from './Store'
import { WatchOptions } from './watch'

type State<T, D> = [T, D]

export const useForm = <T extends OBJ = OBJ>(data?: T) => {
  return useMemo(() => new Store<T>(data), [])
}
type CallBack<T, D> = (state: State<T | any[], D>) => void

type P<F, T> = F extends Array<string> ? any[] : T
type Field = string | string[]
export const useFormInstance = <T extends object = OBJ>() =>
  useContext(Context as unknown as React.Context<ContextProp<T>>)
export const useWatch = <T, D extends object = OBJ>(
  field: Field,
  outForm?: Store<D> | Rpor<D>,
  callBack?: CallBack<T, D>,
  options?: WatchOptions
) => {
  const inform = useFormInstance<D>()
  const form = outForm ?? inform
  const [state, setState] = useState<State<P<typeof field, T>, D>>(
    Array.isArray(field)
      ? [field.map((k) => form?.getValue(k)), form?.getValues()]
      : [form?.getValue(field), form?.getValues()]
  )
  useLayoutEffect(() => {
    const isArr = Array.isArray(field)
    const list = isArr ? field : [field]
    return form?.subscribe<T>(
      list,
      (_field, { value, newValueList = [], row }) => {
        const val: State<P<typeof field, T>, D> = [
          isArr ? newValueList : value,
          row
        ]
        setState(val)
        callBack?.(val)
      },
      options
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])
  return state
}
