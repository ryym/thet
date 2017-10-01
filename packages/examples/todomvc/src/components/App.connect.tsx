import * as React from 'react';
import { connect } from 'thisy-react'
import { Send } from 'thisy'
import { TodoCounts } from '../lib/todo'
import { Todos, Inputs } from '../store'
import Header from './Header'
import TodoTextInput from './TodoTextInput';
import TodoList from './TodoList.connect'
import Footer from './Footer'

type Props = {
  counts: TodoCounts,
  filter: string,
  send: Send,
  toggleCompletedAll: () => void,
}

export function App({
  counts, filter, send, toggleCompletedAll
}: Props) {
  return (
    <section className="todoapp">
      <Header addTodo={send.to(Todos.$add)} />
      <section className="main">
        {counts.all > 0 && (
          <div>
            <input
              id="toggle-all"
              className="toggle-all"
              type="checkbox"
              checked={counts.active === 0}
              onChange={toggleCompletedAll}
            />
            <label htmlFor="toggle-all">
              Mark all as complete
            </label>
          </div>
        )}
        <TodoList />
        {counts.all > 0 && (
          <Footer
            completedCount={counts.completed}
            activeCount={counts.active}
            filter={filter}
            onClearCompleted={send.to(Todos.$deleteCompleted)}
            onShow={send.to(Inputs.$changeFilter)}
          />
        )}
      </section>
    </section>
  )
}

export default connect(App, {
  mapProps: send => {
    const toggleCompletedAll = (): void => {
      const counts = send(Todos.getCounts)
      if (counts.all > 0) {
        const allCompleted = counts.active === 0;
        send(Todos.$toggleCompletedAll, !allCompleted)
      }
    };
    return () => ({
      send,
      toggleCompletedAll,
      counts: send(Todos.getCounts),
      filter: send(Inputs.getCurrentFilter),
    })
  }
})
