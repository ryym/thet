import union from 'lodash.union';
import ResourceMap from './resource-map';

export default class Pagination {
  constructor(resource = new ResourceMap()) {
    this.pagination = resource;
  }

  getInitialState() {
    return {
      isFetching: false,
      nextPageUrl: undefined,
      pageCount: 0,
      ids: [],
    };
  }

  get(key) {
    return this.pagination.get(key) || {};
  }

  startFetching(key) {
    this.pagination.update(key, pg => ({
      ...pg,
      isFetching: true,
    }), this.getInitialState());
  }

  finishFetching(key, { ids, nextPageUrl }) {
    this.pagination.update(key, pg => ({
      isFetching: false,
      pageCount: pg.pageCount + 1,
      nextPageUrl,
      ids: union(pg.ids, ids),
    }));
  }

  toObject() {
    return this.pagination.toObject();
  }
}
