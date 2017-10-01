import { methodsOf } from 'thisy';
import { EntitiesA } from './entities-state';
import Pagination from './lib/pagination';

export default class StarredState {
  constructor(send, api, pagination = new Pagination()) {
    this.send = send;
    this.api = api;
    this.pagination = pagination;
  }

  getPagination(login) {
    return this.pagination.get(login);
  }

  get(login) {
    const { ids = [] } = this.getPagination(login);
    return ids.map(this.send.to(EntitiesA.getRepo));
  }

  load(login, loadMore = false) {
    const { send, api } = this;
    const { pageCount = 0, nextPageUrl } = this.getPagination(login);

    if (loadMore || pageCount === 0) {
      send(this.$startFetching, login);
      send(api.fetchStarred, login, nextPageUrl).then(res => {
        this.send(this.$mergeResults, login, res);
      });
    }
  }

  $startFetching(login) {
    this.pagination.startFetching(login);
  }

  $mergeResults(login, res) {
    const { entities, result: ids, nextPageUrl } = res;
    this.pagination.finishFetching(login, { ids, nextPageUrl });
    this.send(EntitiesA.$updateEntities, entities);
  }

  takeSnapshot() {
    return this.pagination.toObject();
  }
}

export const StarredA = methodsOf(StarredState);
