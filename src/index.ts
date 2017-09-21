type Subscriber = (
  method: (...args: any[]) => any,
  store: Store
) => void

export interface CallFunc {
  <R>(method: () => R): R;
  <A, R>(method: (a: A) => R, a: A): R;
  <A, B, R>(method: (a: A, b: B) => R, a: A, b: B): R;
}

export interface Call extends CallFunc {
  for<R>(method: () => R): () => R;
  for<A, R>(method: (a: A) => R): (a: A) => R;
  for<A, B, R>(method: (a: A, b: B) => R): (a: A, b: B) => R;
}

const makeCall = (call: CallFunc): Call => Object.assign(call, {
  // XXX: 本当はインスタンスに紐付いたメソッドを直接返せると関数生成する必要がなくなるけど、
  // 監視の仕組みがないと無理。
  // XXX: 事前に引数をバインドしたくなるけど、メソッドを返す事はできなくなる
  for: (method: any) => (...args: any[]) => call(method, ...args)
})

export class Store {
  private states: Map<Function, {}> = new Map();
  private subscribers: Subscriber[] = [];

  // XXX: getterは状態変更ではないので処理を変えないといけない。
  // 通知はいらないし、subscribe内で getter 使うと無限ループ。
  call: Call = makeCall((method: any, ...args: any[]): any => {
    const state = this.states.get(method.__class__)

    // XXX: もし state が無かったらエラーになるけどそこはどうしようもなさそう。。
    const result = method.apply(state, args)

    this.subscribers.forEach(sb => {
      sb(method, this)
    })

    return result
  })

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

  get<P, C extends Class<P>>(clazz: C): P | undefined {
    return <P>this.states.get(clazz)
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

//   greet(name: string): string {
//     return `Hello, ${name}!`
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

// const s: string = store.call.for(FooC.greet)('john')
// console.log(s)
