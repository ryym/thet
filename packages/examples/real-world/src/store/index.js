import { makeStore } from 'thisy'
import * as fetchers from './lib/fetchers'
import APIWrapper from './lib/api-wrapper'
import AppState, { AppA } from './app-state'
import RouterState, { RouterA } from './router-state'
import EntitiesState, { EntitiesA } from './entities-state'
import UsersState, { UsersA } from './users-state'
import ReposState, { ReposA } from './repos-state'
import StarredState, { StarredA } from './starred-state'
import StargazersState, { StargazersA } from './stargazers-state'
import MessagesState, { MessagesA } from './messages-state'

export {
  AppA,
  RouterA,
  EntitiesA,
  UsersA,
  StarredA,
  ReposA,
  StargazersA,
  MessagesA,
}

export default (history) => makeStore(send => {
  const api = new APIWrapper(send, fetchers)

  return [
    new AppState(send),
    new RouterState(history),
    new EntitiesState(),
    new UsersState(send, api),
    new ReposState(send, api),
    new StarredState(send, api),
    new StargazersState(send, api),
    new MessagesState(),
  ]
})
