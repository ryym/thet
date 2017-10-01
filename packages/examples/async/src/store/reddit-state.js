import { methodsOf, updater } from 'thisy';
import RedditMap from './reddit-map';
import fetchRedditPosts from '../api/fetch-reddit-posts';

export default class RedditState {
  constructor(send, fetchPosts = fetchRedditPosts) {
    this.send = send;
    this.reddits = new RedditMap();
    this.fetchPosts = fetchPosts;
  }

  getOrInitReddit(category) {
    return this.reddits.getOrInit(category);
  }

  hasReddit(category) {
    return this.reddits.has(category);
  }

  fetchReddit(category) {
    this.send(this.startRedditRequest, category);
    return this.fetchPosts(category).then(posts => {
      this.send(this.succeedRedditRequest, category, {
        posts,
        receivedAt: Date.now(),
      });
    });
  }

  @updater
  startRedditRequest(category) {
    this.reddits.updateOrInit(category, data => ({
      ...data,
      isFetching: true,
    }));
  }

  @updater
  succeedRedditRequest(category, { posts, receivedAt }) {
    this.reddits.updateOrInit(category, () => ({
      isFetching: false,
      posts,
      lastUpdated: receivedAt,
    }));
  }

  takeSnapshot() {
    return this.reddits.toObject();
  }
}

export const RedditAct = methodsOf(RedditState);
