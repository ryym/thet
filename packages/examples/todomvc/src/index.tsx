import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'thisy-react'
import makeStore from './store'
import App from './components/App.connect'

import 'todomvc-app-css/index.css'

const store = makeStore()

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
