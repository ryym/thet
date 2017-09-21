type Subscriber = (
  method: (...args: any[]) => any,
  store: Store
) => void

export interface Call {
  <R>(method: () => R): R;
  <A, R>(method: (a: A) => R, a: A): R;
  <A, B, R>(method: (a: A, b: B) => R, a: A, b: B): R;
}

export class Store {
  private states: Map<Function, {}> = new Map();
  private subscribers: Subscriber[] = [];

  constructor() {
    this.call = this.call.bind(this)
  }

  call: Call = (method: any, ...args: any[]): any => {
    const state = this.states.get(method.__class__)

    // XXX: もし state が無かったらエラーになるけどそこはどうしようもなさそう。。
    return method.apply(state, args)
  }

  watch = (states: Array<{}>): void => {
    this.states = new Map()
    states.forEach(state => {
      this.states.set(state.constructor, state)
    })
  }

  subscribe(sb: Subscriber): () => void {
    this.subscribers.push(sb)
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== sb)
    }
  }
}

interface Class<Proto> {
  new(...args: any[]): Proto
}

export function makeCalls<Proto>(clazz: Class<Proto>): Proto
export function makeCalls(clazz: any): any {
  return Object.getOwnPropertyNames(clazz.prototype).reduce((calls: any, name) => {
    calls[name] = clazz.prototype[name]
    calls[name].__class__ = clazz
    return calls
  }, {})
}

export function makeStore(
  makeStates: (call: Call) => Array<{}>
): Store {
  const store = new Store()
  const states = makeStates(store.call)
  store.watch(states)
  return store
}

// class Foo {
//   private v: string
//   constructor(v = 'default') {
//     this.v = v
//   }
//   check() {
//     console.log('YEY!', this.v)
//   }
// }

// const FooC = makeCalls(Foo)

// const store = makeStore(call => [
//   new Foo()
// ])

// store.call(FooC.check)

// const f = new Foo('another')
// store.watch([f])

// store.call(FooC.check)
