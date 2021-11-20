import React from 'react'
import { Context as C } from './interface'

const Context = React.createContext<C>({} as C)

export default Context
