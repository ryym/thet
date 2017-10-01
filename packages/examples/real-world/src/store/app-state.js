import { methodsOf } from 'thisy'
import { RouterA } from './router-state'
import { EntitiesA } from './entities-state'
import { StarredA } from './starred-state'
import { StargazersA } from './stargazers-state'
import { MessagesA } from './messages-state'

export default class AppState {
  constructor(send) {
    this.send = send
  }

  takeSnapshot() {
    const { send } = this
    return {
      router: send(RouterA.takeSnapshot),
      entities: send(EntitiesA.takeSnapshot),
      starred: send(StarredA.takeSnapshot),
      stargazers: send(StargazersA.takeSnapshot),
    }
  }
}

export const AppA = methodsOf(AppState)
