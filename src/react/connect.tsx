import * as React from 'react'
import { ComponentClass, StatelessComponent } from 'react'
import shallowEqual from './utils/shallow-equal'
import { Store, Call } from '../'
import contextTypes from './context-types'

export type ReactComponent<P> = ComponentClass<P> | StatelessComponent<P>;

export type ConnectConfig<P, WP> = {
  mapProps: (call: Call) => (wrapperProps: WP) => P
}

export type ConnectorState<P> = {
  mappedProps: P
}

export default function connect<S, P, WP = {}>(
  WrappedComponent: ReactComponent<P>,
  config: ConnectConfig<P, WP>
): ComponentClass<WP> {
  const { mapProps: makeMapProps } = config

  class Connected extends React.Component<WP, ConnectorState<P>> {
    static contextTypes = contextTypes

    private store: Store
    private mapProps: (wrapperProps: WP) => P
    private unsubscribe: (() => void) | null = null

    constructor(props: WP, context: any) {
      super(props, context)
      this.store = context.store
      this.mapProps = makeMapProps(this.store.call)
      const mappedProps = this.mapProps(this.props)
      this.state = { mappedProps }
    }

    render() {
      return <WrappedComponent {...this.state.mappedProps} />
    }

    componentWillMount() {
      if (!this.unsubscribe) {
        this.unsubscribe = this.store.subscribe(() => {
          this.updateMappedProps(this.props)
        })
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
    }

    componentWillReceiveProps(nextProps: WP) {
      this.updateMappedProps(nextProps)
    }

    shouldComponentUpdate(nextProps: WP, nextState: ConnectorState<P>) {
      return !shallowEqual(this.state.mappedProps, nextState.mappedProps)
    }

    updateMappedProps(props: WP) {
      const mappedProps = this.mapProps(props)
      this.setState({ mappedProps })
    }
  }

  return Connected
}
