import { makeStore } from 'thet'
import AppState, { Act } from './app-state';
import RedditState from './reddit-state';

export { Act }

export default makeStore(send => [
  new AppState(send),
  new RedditState(send)
])
