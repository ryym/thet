import { methodsOf } from 'thisy'
import { SHOW_ALL } from '../lib/todo-filters';

export default class InputState {
  constructor(
    private filter: string = SHOW_ALL,
    private editedId: number | null = null
  ) {}

  getCurrentFilter(): string {
    return this.filter;
  }

  $changeFilter(filter: string): void {
    this.filter = filter;
  }

  getEditedId(): number | null {
    return this.editedId;
  }

  $startEditing(id: number): void {
    this.editedId = id;
  }

  $finishEditing(): void {
    this.editedId = null;
  }
}

export const Inputs = methodsOf(InputState)
