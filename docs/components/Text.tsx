import React, { useMemo } from 'react'
import { defineComponent, withDynamicData } from '@hanyk/general-form'

type Props = {
  options: Array<{ label: string; value: string }>
  split: string
}

export default withDynamicData(
  defineComponent<Props>(({ value, options, split = '/' }) => {
    return useMemo(() => {
      if (!value) return '-'
      let val = value
      if (!Array.isArray(value)) {
        val = [value]
      }
      if (options && options.length) {
        val = val.map(
          (v: string) =>
            options.find((obj) => obj.value.toString() === v.toString())?.label
        )
      }
      return val.join(split)
    }, [options, split, value])
  })
)
