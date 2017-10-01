import { Send, makeSend } from './send';
import { Store } from './store';
import { methodsOf, markAsUpdater } from './methods';

export {
  Store,
  Send,
  makeSend,
  methodsOf,
  markAsUpdater as updater,
};

export function makeStore(
  makeStates: (send: Send) => Array<{}>,
): Store {
  const store = new Store();
  const states = makeStates(store.send);
  store.watch(states);
  return store;
}
