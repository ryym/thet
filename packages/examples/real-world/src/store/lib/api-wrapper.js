import { MessagesA } from '../messages-state';

export default class APIWrapper {
  constructor(send, api) {
    this.send = send;
    this.api = api;
  }

  fetchUser = (login) => {
    return this.captureError(this.api.fetchUser(login));
  }

  fetchRepo = (fullName) => {
    return this.captureError(this.api.fetchRepo(fullName));
  }

  fetchStarred = (login, nextPageUrl) => {
    return this.captureError(this.api.fetchStarred(login, nextPageUrl));
  }

  fetchStargazers = (fullName, nextPageUrl) => {
    return this.captureError(this.api.fetchStargazers(fullName, nextPageUrl));
  }

  captureError = (request) => {
    return request.catch(err => {
      this.send(MessagesA.$setMessage, err.message);
      throw err;
    });
  }
}
