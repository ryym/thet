import { makeSend, Send } from './send'
import { META_DATA_KEY, Class } from './consts'

export class Store {
  private states: Map<Function, {}> = new Map();
  private subscribers: Subscriber[] = [];

  send: Send = makeSend((method: any, args: any[], meta: any): any => {
    if (typeof method !== 'function') {
      throw new Error(`'send' accepts functions only. passed: ${method}`)
    }
    if (meta == null) {
      return method(...args)
    }

    const { clazz, isUpdater } = meta
    const state = this.states.get(clazz)
    if (state === undefined) {
      throw new Error(`${clazz} does not be managed by this store.`)
    }

    const result = method.apply(state, args)

    if (isUpdater) {
      this.subscribers.forEach(sb => {
        sb(method, this)
      })
    }

    return result
  })

  watch = (states: Array<{}>): void => {
    this.states = new Map()
    states.forEach(state => {
      this.states.set(state.constructor, state)
    })
  }

  subscribe = (sb: Subscriber): () => void => {
    this.subscribers.push(sb)
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== sb)
    }
  }
}

export type Subscriber = (
  method: (...args: any[]) => any,
  store: Store
) => void
