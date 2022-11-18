import { Common, Comp } from './interface'

export const components: Comp = {}

export const registerComponent = (obj: Comp) => {
  Object.assign(components, obj)
}
