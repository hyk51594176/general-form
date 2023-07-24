import React from 'react'
import { ContextProp } from './interface'

const Context = React.createContext<ContextProp>({} as ContextProp)

export default Context
