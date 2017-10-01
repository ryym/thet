import { methodsOf } from 'thisy';
import { EntitiesA } from './entities-state';
import Pagination from './lib/pagination';

export default class StargazersState {
  constructor(send, api, pagination = new Pagination()) {
    this.send = send;
    this.api = api;
    this.pagination = pagination;
  }

  getPagination(fullName) {
    return this.pagination.get(fullName);
  }

  get(fullName) {
    const { ids = [] } = this.send(this.getPagination, fullName);
    return ids.map(this.send.to(EntitiesA.getUser));
  }

  load(fullName, loadMore = false) {
    const { send, api } = this;
    const { pageCount = 0, nextPageUrl } = this.getPagination(fullName);

    if (loadMore || pageCount === 0) {
      send(this.$startFetching, fullName);
      send(api.fetchStargazers, fullName, nextPageUrl).then(res => {
        this.send(this.$mergeResults, fullName, res);
      });
    }
  }

  $startFetching(fullName) {
    this.pagination.startFetching(fullName);
  }

  $mergeResults(fullName, res) {
    const { entities, result: ids, nextPageUrl } = res;
    this.pagination.finishFetching(fullName, { ids, nextPageUrl });
    this.send(EntitiesA.$updateEntities, entities);
  }

  takeSnapshot() {
    return this.pagination.toObject();
  }
}

export const StargazersA = methodsOf(StargazersState);

