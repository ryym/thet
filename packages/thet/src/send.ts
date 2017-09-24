export interface SendFunc {
  <R>(method: () => R): R;
  <A, R>(method: (a: A) => R, a: A): R;
  <A, B, R>(method: (a: A, b: B) => R, a: A, b: B): R;
}

export interface Send extends SendFunc {
  to<R>(method: () => R): () => R;
  to<A, R>(method: (a: A) => R): (a: A) => R;
  to<A, B, R>(method: (a: A, b: B) => R): (a: A, b: B) => R;
}

export const makeSend = (send: SendFunc): Send => Object.assign(send, {
  // It is nice if `to` could return a pre-bound function
  // instead of creating a new function every time.
  to: (method: any) => (...args: any[]) => send(method, ...args)
})
