import { makeStore } from 'thisy'
import * as fetchers from './fetchers'
import AppState, { AppA } from './app-state'
import RouterState, { RouterA } from './router-state'
import EntitiesState, { EntitiesA } from './entities-state'
import PaginationsState, { PaginationsA } from './paginations-state'
import MessagesState, { MessagesA } from './messages-state'

export {
  AppA,
  RouterA,
  EntitiesA,
  PaginationsA,
  MessagesA,
}

export default (history) => makeStore(send => [
  new AppState(send, fetchers),
  new RouterState(history),
  new EntitiesState(),
  new PaginationsState(),
  new MessagesState(),
])
