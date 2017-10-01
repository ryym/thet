import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'thisy-react';
import makeStore, { AppA } from './store';
import App from './components/App';

// https://github.com/ReactTraining/react-router/issues/5237
import createHistory from 'history/createBrowserHistory';

// TODO: use @updater

const history = createHistory();
const store = makeStore(history);

store.subscribe((m, args) => {
  console.log('UPDATE', m.name, args);
  console.log('State:', store.send(AppA.takeSnapshot));
});

render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
);
