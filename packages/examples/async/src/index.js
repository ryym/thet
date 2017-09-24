import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'thet-react'
import App from './components/App.connect';
import store, { Act } from './store';

// Logging
// TODO: Want to subscribe effect methods

// TODO: Use decorator

store.subscribe((method, store) => {
  console.log(`Update: ${method.name}`, store.send(Act.takeSnapshot));
});

store.send(Act.loadInitialReddit)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
