import * as React from 'react'
import { render } from 'react-dom'
import { makeStore, makeCalls } from 'thill'

class State {
  constructor(call, count = 0) {
    this.call = call
    this.count = count
  }

  getCount() {
    return this.count
  }

  increment() {
    this.count += 1
  }

  incrementIfOdd() {
    if (this.count % 2 === 1) {
      this.count += 1
    }
  }

  incrementAsync(delay) {
    setTimeout(() => {
      this.call(C.increment)
    }, delay)
  }
}

const C = makeCalls(State)

const Counter = ({ value = 0, call }) => {
  return (
    <div>
      <p>
        Clicked: {value} times
      </p>
      <button onClick={() => call(C.increment)}>
        Increment
      </button>
      <button onClick={() => call(C.incrementIfOdd)}>
        IncrementIfOdd
      </button>
      <button onClick={() => call(C.incrementAsync, 500)}>
        IncrementAsync
      </button>
    </div>
  );
};

const renderCounter = (store) => {
  const count = store.get(State).getCount() // XXX
  render(
    <Counter value={count} call={store.call} />,
    document.getElementById('root')
  )
}

const store = makeStore(call => [
  new State(call)
])

store.subscribe((method) => {
  console.log('Dispatched', method.name, store.get(State))
  renderCounter(store)
})

renderCounter(store)
