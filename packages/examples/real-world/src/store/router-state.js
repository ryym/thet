import { methodsOf } from 'thisy'

export default class RouterState {
  constructor(history) {
    this.history = history
  }

  getCurrentPath() {
    return this.history.location.pathname.substring(1)
  }

  navigate(path) {
    this.history.push(path)
  }

  takeSnapshot() {
    const { location } = this.history
    return {
      pathname: location.pathname,
    }
  }
}

export const RouterA = methodsOf(RouterState)
