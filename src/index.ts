import { Send } from './send'
import { Store } from './store'

export { Store, Send }
export { default as methodsOf } from './methods-of'

export function makeStore(
  makeStates: (send: Send) => Array<{}>
): Store {
  const store = new Store()
  const states = makeStates(store.send)
  store.watch(states)
  return store
}
