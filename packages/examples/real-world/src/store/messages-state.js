import { methodsOf } from 'thisy'

export default class Messages {
  constructor() {
    this.message = ""
  }

  getMessage() {
    return this.message
  }

  $setMessage(message) {
    this.message = message
  }
}

export const MessagesA = methodsOf(Messages)
