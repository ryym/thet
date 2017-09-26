import { makeStore } from 'thisy'
import AppState, { Act } from './app-state';
import RedditState, { RedditAct } from './reddit-state';

const MergedAct = Object.assign({}, Act, {
  getOrInitReddit: RedditAct.getOrInitReddit,
})
export { MergedAct as Act }

export default makeStore(send => [
  new AppState(send),
  new RedditState(send)
])
