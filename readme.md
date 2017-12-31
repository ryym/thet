# Thisy

Thisy is a toy library to manage application state using plain classes.

```javascript
import { methodsOf, makeStore } from 'thisy'

// 1.
// Define a state class.
class CounterState {
  constructor(count = 0) {
    this.count = count
  }

  getCount() {
    return this.count
  }

  // A state modifier method must have a `$` prefix.
  $increment(n = 1) {
    this.count += n
  }
}

// 2.
// Extract the state class methods.
// They are `Action`s in Flux.
const Act = methodsOf(CounterState)
console.log(typeof Act.$increment) //=> 'function'

// 3.
// Create a store.
const store = makeStore(() => [new CounterState()])

// You can subscribe state updates.
store.subscribe(act => console.log('Updated by', act.name))

// 4.
// Send an action to update the state!
store.send(Act.$increment, 10)
//=> 'Updated by $increment'

// 5.
// `send` can also be used to get state data.
console.log(store.send(Act.getCount))
//=> 1
```

Using with React:

```javascript
import { Provider, connect } from 'thisy-react'
import { Act } from '../store/counter'

// Define a component.
const Counter = ({ send, title, count }) => (
  <div>
    <h1>{title}</h1>
    <p>Count: {count}</P>
    <button onClick={() => send(Act.$increment)}>
      Increment
    </button>
  </div>
)

// Connect the component with your store.
const ConnectedCounter = connect(Conunter, {
  mapProps: send => ({ title }) => ({
    send,
    title,
    count: send(Act.getCount),
  }),
})

ReactDOM.render(
  <Provider store={store}>
    <ConnectedCounter title="Counter example" />
  </Provider>,
  document.getElementByID('counter')
)
```
