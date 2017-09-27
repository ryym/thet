import { methodsOf, updater } from 'thisy'
import { RedditAct } from './reddit-state'

export default class AppState {
  constructor(send, category = 'reactjs') {
    this.send = send
    this.category = category;
  }

  getCurrentCategory() {
    return this.category;
  }

  @updater
  setCategory(category) {
    this.category = category;
  }

  loadInitialReddit() {
    return this.send(RedditAct.fetchReddit, this.category)
  }

  changeCategory(category) {
    const prevCategory = this.category;

    this.send(this.setCategory, category)
    if (prevCategory !== category && !this.send(RedditAct.hasReddit, category)) {
      return this.send(RedditAct.fetchReddit, category)
    }
    return Promise.resolve();
  }

  invalidateCategory(category) {
    return this.send(RedditAct.fetchReddit, category)
  }

  takeSnapshot() {
    return {
      category: this.category,
      reddits: this.send(RedditAct.takeSnapshot),
    };
  }
}

export const Act = methodsOf(AppState)
