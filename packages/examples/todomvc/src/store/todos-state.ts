import { Send, methodsOf } from 'thisy';
import { Todo, TodoCounts } from '../lib/todo';
import { SHOW_ACTIVE, SHOW_COMPLETED } from '../lib/todo-filters';
import { Inputs } from './inputs-state';

export default class TodosState {
  constructor(
    private readonly send: Send,
    private todos: Todo[] = [],
  ) {}

  listFiltered(): Todo[] {
    const filter = this.send(Inputs.getCurrentFilter);
    switch (filter) {
    case SHOW_ACTIVE:
      return this.listActive();
    case SHOW_COMPLETED:
      return this.listCompleted();
    default:
      return this.todos;
    }
  }

  private listCompleted(): Todo[] {
    return this.todos.filter((t) => t.completed);
  }

  private listActive(): Todo[] {
    return this.todos.filter((t) => !t.completed);
  }

  getCounts(): TodoCounts {
    const nActives = this.todos.filter((t) => !t.completed).length;
    return {
      all: this.todos.length,
      active: nActives,
      completed: this.todos.length - nActives,
    };
  }

  $add(title: string): void {
    const todo = Todo.create({ title });
    this.todos = this.todos.concat(todo);
  }

  $update(id: number, title: string): void {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        todo.title = title;
      }
      return todo;
    });
  }

  $toggleCompleted(id: number): void {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
  }

  $toggleCompletedAll(completed: boolean): void {
    this.todos = this.todos.map((todo) => {
      todo.completed = completed;
      return todo;
    });
  }

  $delete(id: number): void {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  $deleteCompleted(): void {
    this.todos = this.todos.filter((t) => !t.completed);
  }
}

export const Todos = methodsOf(TodosState);
