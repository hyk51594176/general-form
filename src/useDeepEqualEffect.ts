import { isEqual } from 'lodash'
import React from 'react'

type DeepIsEqualType<TDeps = React.DependencyList> = (newDeps: TDeps, oldDeps: TDeps) => boolean
function useDeepEqualEffect<TDeps = React.DependencyList>(
  effect: React.EffectCallback,
  deps: TDeps,
  compare: DeepIsEqualType<TDeps> = isEqual
) {
  const oldDeps = React.useRef<TDeps | undefined>(undefined)
  if (!oldDeps.current || !compare(deps, oldDeps.current as TDeps)) {
    oldDeps.current = deps
  }

  React.useEffect(effect, [oldDeps.current])
}
export default useDeepEqualEffect
