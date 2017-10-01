import { methodsOf } from 'thisy';
import { EntitiesA } from './entities-state';

export default class UsersState {
  constructor(send, api) {
    this.send = send;
    this.api = api;
  }

  get(login) {
    return this.send(EntitiesA.getUser, login);
  }

  load(login) {
    const { send, api } = this;
    if (send(EntitiesA.hasUser, login)) {
      return Promise.resolve();
    }
    return send(api.fetchUser, login).then(res => {
      send(EntitiesA.$updateEntities, res.entities);
    });
  }
}

export const UsersA = methodsOf(UsersState);
