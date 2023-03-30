import { Comp } from './interface'

export const components: Comp = {} as Comp

export const registerComponent = (obj: Comp) => {
  Object.assign(components, obj)
}
