import { useCallback } from 'react'
import { Modal } from 'antd'

export const useSubmit = () => {
  const submit = useCallback(async (data: object) => {
    Modal.success({
      title: '操作成功',
      content: JSON.stringify(data)
    })
  }, [])
  return submit
}
