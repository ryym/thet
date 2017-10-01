import * as React from 'react';
import { connect } from 'thisy-react';
import { Send } from 'thisy'
import { Todos, Inputs } from '../store'
import TodoItem from './TodoItem';
import { Todo } from '../lib/todo';

type Props = {
  todos: Todo[],
  filter: string,
  editedId: number | null,
  send: Send,
}

export class TodoList extends React.Component<Props> {
  handleTodoSave = (id: number, title: string) => {
    const { send } = this.props
    if (title.length === 0) {
      send(Todos.$delete, id)
    } else {
      send(Todos.$update, id, title)
    }
    send(Inputs.$finishEditing)
  }

  render() {
    const { send, filter, todos, editedId } = this.props;
    return (
      <ul className="todo-list">
        {todos.map(todo =>
          <TodoItem
            key={todo.id}
            todo={todo}
            editing={todo.id === editedId}
            onDeleteClick={send.to(Todos.$delete)}
            onCompletedToggle={send.to(Todos.$toggleCompleted)}
            onEditStart={send.to(Inputs.$startEditing)}
            onEditEnd={this.handleTodoSave}
          />
        )}
      </ul>
    );
  }
}

export default connect(TodoList, {
  mapProps: send => () => ({
    send,
    todos: send(Todos.listFiltered),
    filter: send(Inputs.getCurrentFilter), 
    editedId: send(Inputs.getEditedId),
  })
})
