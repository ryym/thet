import { methodsOf } from 'thisy';
import ResourceMap from './lib/resource-map';

export default class EntitiesState {
  constructor({
    users = new ResourceMap(),
    repos = new ResourceMap(),
  } = {}) {
    this.users = users;
    this.repos = repos;
  }

  getUser(login) {
    return this.users.get(login);
  }

  getRepo(fullName) {
    return this.repos.get(fullName);
  }

  hasUser(login) {
    return Boolean(this.getUser(login));
  }

  hasRepo(fullName) {
    return Boolean(this.getRepo(fullName));
  }

  $updateEntities({ users = {}, repos = {} }) {
    this.users.merge(users);
    this.repos.merge(repos);
  }

  takeSnapshot() {
    return {
      user: this.users.toObject(),
      repos: this.repos.toObject(),
    };
  }
}

export const EntitiesA = methodsOf(EntitiesState);
