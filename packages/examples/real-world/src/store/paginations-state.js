import { methodsOf } from 'thisy'
import union from 'lodash/union'
import Pagination from './pagination'

export default class Paginations {
  constructor({
    starredByUser = new Pagination(),
    stargazersByRepo = new Pagination(),
  } = {}) {
    this.starredByUser = starredByUser
    this.stargazersByRepo = stargazersByRepo
  }

  getStarred(login) {
    return this.starredByUser.get(login) || {}
  }

  getStargazers(fullName) {
    return this.stargazersByRepo.get(fullName) || {}
  }

  $requestStarred(login) {
    this.starredByUser.startFetching(login)
  }

  $receiveStarred(login, { ids, nextPageUrl }) {
    this.starredByUser.finishFetching(login, { ids, nextPageUrl })
  }

  $requestStargazers(fullName) {
    this.stargazersByRepo.startFetching(fullName)
  }

  $receiveStargazers(fullName, { ids, nextPageUrl }) {
    this.stargazersByRepo.finishFetching(fullName, { ids, nextPageUrl })
  }

  takeSnapshot() {
    return {
      starredByUser: this.starredByUser.toObject(),
      stargazersByRepo: this.stargazersByRepo.toObject(),
    }
  }
}

export const PaginationsA = methodsOf(Paginations)
