import { methodsOf } from 'thisy'
import { EntitiesA } from './entities-state'

export default class ReposState {
  constructor(send, api) {
    this.send = send
    this.api = api
  }

  get(fullName) {
    return this.send(EntitiesA.getRepo, fullName)
  }

  getOwner(repo) {
    return repo ? this.send(EntitiesA.getUser, repo.owner) : null
  }

  load(fullName) {
    const { send, api } = this
    if (send(EntitiesA.hasRepo, fullName)) {
      return Promise.resolve()
    }
    return send(api.fetchRepo, fullName).then(res => {
      send(EntitiesA.$updateEntities, res.entities)
    })
  }
}

export const ReposA = methodsOf(ReposState)
