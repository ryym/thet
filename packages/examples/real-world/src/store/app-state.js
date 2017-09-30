import { methodsOf } from 'thisy'
import { RouterA } from './router-state'
import { PaginationsA } from './paginations-state'
import { EntitiesA } from './entities-state'
import { MessagesA } from './messages-state'

export default class AppState {
  constructor(send, api) {
    this.send = send
    this.api = api
  }

  takeSnapshot() {
    const { send } = this
    return {
      router: send(RouterA.takeSnapshot),
      entities: send(EntitiesA.takeSnapshot),
      paginations: send(PaginationsA.takeSnapshot),
    }
  }

  getStarredRepos(login) {
    const { ids = [] } = this.send(PaginationsA.getStarred, login)
    return ids.map(this.send.to(EntitiesA.getRepo))
  }

  getStargazers(fullName) {
    const { ids = [] } = this.send(PaginationsA.getStargazers, fullName)
    return ids.map(this.send.to(EntitiesA.getUser))
  }

  getOwners(repos) {
    return repos.map(repo => this.send(EntitiesA.getUser, repo.owner))
  }

  // TODO: Couldn't be more DRY?

  loadUser(login) {
    const { send, api } = this
    if (send(EntitiesA.hasUser, login)) {
      return Promise.resolve()
    }
    return this.catchError(send(api.fetchUser, login))
      .then(res => send(EntitiesA.$updateEntities, res.entities))
  }

  loadRepo(fullName) {
    const { send, api } = this
    if (send(EntitiesA.hasRepo, fullName)) {
      return Promise.resolve()
    }
    return this.catchError(send(api.fetchRepo, fullName))
      .then(res => send(EntitiesA.$updateEntities, res.entities))
  }

  loadStarred(login, loadMore = false) {
    const { send, api } = this
    const { pageCount = 0, nextPageUrl } = send(PaginationsA.getStarred, login)

    if (loadMore || pageCount === 0) {
      send(PaginationsA.$requestStarred, login)
      this.catchError(send(api.fetchStarred, login, nextPageUrl))
        .then(res => {
          this.receiveEntities(PaginationsA.$receiveStarred, login, res)
        })
    }
  }

  loadStargazers(fullName, loadMore = false) {
    const { send, api } = this
    const { pageCount = 0, nextPageUrl } = send(PaginationsA.getStargazers, fullName)

    if (loadMore || pageCount === 0) {
      send(PaginationsA.$requestStargazers, fullName)
      this.catchError(send(api.fetchStargazers, fullName, nextPageUrl))
        .then(res => {
          this.receiveEntities(PaginationsA.$receiveStargazers, fullName, res)
        })
    }
  }

  receiveEntities(receive, key, response) {
    const { entities, result: ids, nextPageUrl } = response
    this.send(EntitiesA.$updateEntities, entities)
    this.send(receive, key, { ids, nextPageUrl })
  }

  catchError(request) {
    return request.catch(err => {
      this.send(MessagesA.$setMessage, err.message)
      throw err
    })
  }
}

export const AppA = methodsOf(AppState)
