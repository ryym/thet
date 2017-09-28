import { META_DATA_KEY, MetaData } from './consts'

export interface SendFunc {
  <R>(method: () => R): R;
  <A, R>(method: (a: A) => R, a: A): R;
  <A, B, R>(method: (a: A, b: B) => R, a: A, b: B): R;
}

export interface Send {
  <R>(method: () => R): R;
  <A, R>(method: (a: A) => R, a: A): R;
  <A, B, R>(method: (a: A, b: B) => R, a: A, b: B): R;
  to<R>(method: () => R): () => R;
  to<A, R>(method: (a: A) => R): (a: A) => R;
  to<A, B, R>(method: (a: A, b: B) => R): (a: A, b: B) => R;
}

export type SendHandler = (method: Function, args: any[], meta: MetaData) => void

export const makeSend = (handler: SendHandler): Send => {
  const send = (method: any, ...args: any[]) =>
    handler(method, args, method[META_DATA_KEY])

  return Object.assign(send, {
    // It is nice if `to` could return a pre-bound function
    // instead of creating a new function every time.
    to: (method: any) => (...args: any[]) => send(method, ...args)
  })
}
