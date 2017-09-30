import React from 'react'
import { connect } from 'thisy-react'
import { RouterA, MessagesA } from '../../store'
import Explore from './Explore'
import Messages from './Messages'

const GITHUB_REPO = 'https://github.com/ryym/thisy'

export class Header extends React.Component {
  handleNewInput = (value) => {
    const { send } = this.props

    const parts = value.split('/')
    if (parts.length <= 2) {
      send(RouterA.navigate, `/${value}`)
    } else {
      send(MessagesA.$setMessage, "Please input user name or repository full name.")
    }
  }

  resetMessage = () => this.props.send(MessagesA.$setMessage, "")

  render() {
    const { inputValue, message } = this.props
    return (
      <div>
        <h1>Explore GitHub users and repos</h1>
        <Explore
          value={inputValue}
          onChange={this.handleNewInput}
        />
        <p>
          Code on <a href={GITHUB_REPO} target="_blank">Github</a>.
        </p>
        <Messages message={message} dismiss={this.resetMessage} />
      </div>
    )
  }
}

export default connect(Header, {
  mapProps: send => () => ({
    send,
    inputValue: send(RouterA.getCurrentPath),
    message: send(MessagesA.getMessage),
  })
})
