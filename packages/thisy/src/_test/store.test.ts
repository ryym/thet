import * as assert from 'assert'
import { Store } from '../store'
import { methodsOf } from '../methods'

describe('Store#send', () => {
  context('with a method of the state', () => {
    it('calls the method with binding instance', () => {
      class A {
        getThis() { return this }
      }
      const act = methodsOf(A)
      const inst = new A()
      const store = new Store()
      store.watch([inst])
      assert.equal(store.send(act.getThis), inst)
    })
  })

  context('with a non-related function', () => {
    it('just calls the function', () => {
      const add = (x: number, y: number) => x + y
      const store = new Store()
      assert.equal(store.send(add, 8, 2), 10)
    })
  })
})

describe('Store#subscribe', () => {
  class A {
    $change() {}
  }
  const act = methodsOf(A)

  it('subscribes updates', () => {
    const store = new Store()
    store.watch([new A()])

    let called = false
    store.subscribe(() => { called = true })
    store.send(act.$change)
    assert(called, 'subscriber function should be fired')
  })

  it('returns unsubscribe function', () => {
    const store = new Store()
    store.watch([new A()])

    let nCalls = 0
    const unsubscribe = store.subscribe(() => { nCalls += 1 })
    store.send(act.$change)
    unsubscribe()
    store.send(act.$change)
    assert.equal(nCalls, 1, 'should be notified only one time')
  })
})
