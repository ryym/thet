import * as React from 'react';
import { render } from 'react-dom';
import { makeStore, methodsOf } from 'thisy';

class CounterState {
  constructor(send, count = 0) {
    this.send = send;
    this.count = count;
  }

  getCount() {
    return this.count;
  }

  $increment() {
    this.count += 1;
  }

  $incrementIfOdd() {
    if (this.count % 2 === 1) {
      this.count += 1;
    }
  }

  // XXX: async 自体の通知はなくてもいいけど、名前は統一したいというケースが結構ありそう。
  // decorator が使えれば一番良い。
  incrementAsync(delay) {
    setTimeout(() => {
      this.send(this.$increment);
    }, delay);
  }
}

const C = methodsOf(CounterState);

const Counter = ({ value = 0, send }) => {
  return (
    <div>
      <p>
        Clicked: {value} times
      </p>
      <button onClick={() => send(C.$increment)}>
        Increment
      </button>
      <button onClick={send.to(C.$incrementIfOdd)}>
        IncrementIfOdd
      </button>
      <button onClick={() => send(C.incrementAsync, 500)}>
        IncrementAsync
      </button>
    </div>
  );
};

const renderCounter = (store) => {
  const count = store.send(C.getCount);
  render(
    <Counter value={count} send={store.send} />,
    document.getElementById('root')
  );
};

const store = makeStore(send => [
  new CounterState(send),
]);

store.subscribe((method) => {
  console.log('Dispatched', method.name, store.getState(CounterState));
  renderCounter(store);
});

renderCounter(store);
