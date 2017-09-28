import * as assert from 'assert'
import { META_DATA_KEY } from '../consts'
import { methodsOf, MetaData } from '../methods'

describe('methodsOf', () => {
  it('extracts methods from the given class', () => {
    class A {
      a() {}
      b() {}
    }
    const act = methodsOf(A)
    const inst = new A()
    assert.deepEqual([act.a, act.b], [inst.a, inst.b])
  })

  it('prevents from calling constructor function', () => {
    class A {}
    const act = methodsOf(A)
    assert.throws(() => act.constructor())
  })

  it('adds meta data to methods', () => {
    class A { a() {} }
    const act = methodsOf(A)
    const meta = (act.a as any)[META_DATA_KEY] as MetaData
    assert.equal(meta.clazz, A)
  })

  it('can be applied with arbitrary instance', () => {
    class A {
      getThis() { return this }
    }
    const act = methodsOf(A)
    const inst = new A()
    assert.equal(act.getThis.apply(inst), inst)
  })
})
