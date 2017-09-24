import * as React from 'react'
import contextTypes from './context-types'
import { Store } from 'thet'

export type ProviderProps = {
  store: Store
}

export default class Provider extends React.Component<ProviderProps> {
  static childContextTypes = contextTypes

  getChildContext() {
    return { store: this.props.store }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}
