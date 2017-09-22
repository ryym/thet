// NEXT:
// - send -> send
// - どのメソッドの呼び出しも send に統一する
// - sendは戻り値を返す
// - 更新メソッドだった場合のみ通知

type Subscriber = (
  method: (...args: any[]) => any,
  store: Store
) => void

export interface SendFunc {
  <R>(method: () => R): R;
  <A, R>(method: (a: A) => R, a: A): R;
  <A, B, R>(method: (a: A, b: B) => R, a: A, b: B): R;
}

export interface Send extends SendFunc {
  to<R>(method: () => R): () => R;
  to<A, R>(method: (a: A) => R): (a: A) => R;
  to<A, B, R>(method: (a: A, b: B) => R): (a: A, b: B) => R;
}

const makeSend = (send: SendFunc): Send => Object.assign(send, {
  // XXX: インスタンスに紐づく関数を返すだけにできたら、と思ってたけど勘違いしてた。
  // そもそもthisに紐付いてないメソッド群をStateにしてるんだから無理。
  // なので単に記述を簡略化する存在になる。
  to: (method: any) => (...args: any[]) => send(method, ...args)
})

export class Store {
  private states: Map<Function, {}> = new Map();
  private subscribers: Subscriber[] = [];

  // XXX: getterは状態変更ではないので処理を変えないといけない。
  // 通知はいらないし、subscribe内で getter 使うと無限ループ。
  send: Send = makeSend((method: any, ...args: any[]): any => {
    const state = this.states.get(method.__thet__.clazz)

    // XXX: もし state が無かったらエラーになるけどそこはどうしようもなさそう。。
    const result = method.apply(state, args)

    if (method.__thet__.isUpdater) {
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

  subscribe(sb: Subscriber): () => void {
    this.subscribers.push(sb)
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== sb)
    }
  }

  getState<P, C extends Class<P>>(clazz: C): P | undefined {
    return <P>this.states.get(clazz)
  }
}

interface Class<Proto> {
  new(...args: any[]): Proto
}

// XXX: naming
export function methodsOf<Proto>(clazz: Class<Proto>): Proto
export function methodsOf(clazz: any): any {
  return Object.getOwnPropertyNames(clazz.prototype).reduce((calls: any, name) => {
    calls[name] = clazz.prototype[name]
    calls[name].__thet__ = {
      clazz,
      // isUpdater: /[A-Z]/.test(name[0]) // とりあえず大文字始まりなら更新メソッド
      isUpdater: name[0] === '$'

    }
    return calls
  }, {})
}

export function makeStore(
  makeStates: (send: Send) => Array<{}>
): Store {
  const store = new Store()
  const states = makeStates(store.send)
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

// const FooC = methodsOf(Foo)

// const store = makeStore(send => [
//   new Foo()
// ])

// store.send(FooC.check)

// const f = new Foo('another')
// store.watch([f])

// store.send(FooC.check)

// const s: string = store.send.for(FooC.greet)('john')
// console.log(s)
