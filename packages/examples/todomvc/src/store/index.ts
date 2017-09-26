import { makeStore }  from 'thisy'

import TodosState from './todos-state'
import InputsState from './inputs-state'

export { Todos } from './todos-state'
export { Inputs } from './inputs-state'

export default () => makeStore(send => [
  new TodosState(send),
  new InputsState(),
])
