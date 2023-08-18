export const getList = (params: { id?: number } = {}) => {
  const data = [
    { label: '山东省', value: 1, parentId: 0 },
    { label: '浙江省', value: 2, parentId: 0 },
    { label: '济南市', value: 3, parentId: 1 },
    { label: '泰安市', value: 4, parentId: 1 },
    { label: '杭州市', value: 5, parentId: 2 },
    { label: '宁波市', value: 6, parentId: 2 },
    { label: '历下区', value: 7, parentId: 3 },
    { label: '历城区', value: 8, parentId: 3 },
    { label: '宁阳县', value: 9, parentId: 4 },
    { label: '肥城市', value: 10, parentId: 4 },
    { label: '西湖区', value: 11, parentId: 5 },
    { label: '余杭区', value: 12, parentId: 5 },
    { label: '海曙区', value: 13, parentId: 6 },
    { label: '鄞州区', value: 14, parentId: 6 }
  ]
  if (typeof params.id === 'string') return Promise.reject()
  return Promise.resolve(data.filter((obj) => obj.parentId === params.id))
}

export const defaultData = {
  name: '123',
  age: '123',
  sex: 1,
  province: 1,
  city: 3,
  area: 7
}
