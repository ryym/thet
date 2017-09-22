import * as React from 'react';
import { connect } from '../thet-react';
import { Send } from '../thet'
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
  // XXX: どうするのがいいのか
  //   1. props として各関数を受け取って呼び出すだけ
  //   2. dispatch だけ受け取って後は内部でやっちゃう
  //   3. この場合分けを包んだ command を用意する
  // 1 が一番きれいだとは思うけど、渡す関数を変えて再利用するようなケースじゃなければ、
  // ロジックはStoreにまかせて dispatch だけする 2 でも別におかしくはない。
  // 3 もロジックが微妙にViewに属している気がして何ともいえない。
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

    // XXX: こういう状態横断的なメソッドはどこに置くべきか。
    // Wrampのようにクラスに階層を作るのはきれいだけど、
    // Viewがその階層を知る必要があるのが面倒だった。
    // Thetの場合sendで自由に他の状態を知れる分、
    // 状態クラス同士の依存関係は気をつけないと破綻する。
    // 今回くらいの規模ならクラスを分けないのもありだけど。。
    todos: send(Todos.listFiltered),

    // XXX: 全部の値に getter が必要なのも確かに面倒
    filter: send(Inputs.getCurrentFilter), 
    editedId: send(Inputs.getEditedId),
  })
})

// const propsMapper = ({ inputs, todoList, getFilteredTodos }: AppState) => {
//   const toggleCompletedAll = (): void => {
//     const counts = todoList.getTodoCounts();
//     if (counts.all > 0) {
//       const allCompleted = counts.active === 0;
//       todoList.$toggleCompletedAll(!allCompleted);
//     }
//   };

//   return (): MainSectionProps => ({
//     todos: getFilteredTodos(),
//     filter: inputs.getCurrentFilter(),
//     editedId: inputs.getEditedId(),
//     changeFilter: inputs.$changeFilter,
//     startEditing: inputs.$startEditing,
//     finishEditing: inputs.$finishEditing,
//     counts: todoList.getTodoCounts(),
//     updateTodo: todoList.$updateTodo,
//     deleteTodo: todoList.$deleteTodo,
//     deleteCompleted: todoList.$deleteCompleted,
//     toggleCompleted: todoList.$toggleCompleted,
//     toggleCompletedAll,
//   });
// };

// export default connect(MainSection, { propsMapper });
