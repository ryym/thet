import React, { Component } from 'react'
import { connect } from 'thisy-react'
import { RouterA, ReposA, StargazersA } from '../store'
import User from './User'
import Repo from './Repo'
import List from './List'

export class RepoPage extends Component {

  loadOwnerAndRepos = (fullName) => {
    const { send } = this.props
    send(ReposA.load, fullName)
    send(StargazersA.load, fullName)
  }

  componentWillMount() {
    this.loadOwnerAndRepos(this.props.fullName)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullName !== this.props.fullName) {
      this.loadOwnerAndRepos(nextProps.fullName)
    }
  }

  handleLoadMoreClick = () => {
    this.props.send(StargazersA.load, this.props.fullName, true)
  }

  renderUser = (user) => {
    return <User user={user} key={user.login} />
  }

  render() {
    const { repo, owner, name } = this.props
    if (!repo || !owner) {
      return <h1><i>Loading {name} details...</i></h1>
    }

    const { stargazers, paginationInfo } = this.props
    return (
      <div>
        <Repo repo={repo} owner={owner} />
        <hr />
        <List
          renderItem={this.renderUser}
          items={stargazers}
          onLoadMoreClick={this.handleLoadMoreClick}
          loadingLabel={`Loading stargazers of ${name}...`}
          {...paginationInfo}
        />
      </div>
    )
  }
}

const mapProps = send => ({ match }) => {
  const { login, name } = match.params
  const fullName = `${login}/${name}`
  const repo = send(ReposA.get, fullName)

  return {
    send,
    fullName,
    repo,
    owner: send(ReposA.getOwner, repo),
    stargazers: send(StargazersA.get, fullName),
    paginationInfo: send(StargazersA.getPagination, fullName),
  }
}

export default connect(RepoPage, { mapProps })
