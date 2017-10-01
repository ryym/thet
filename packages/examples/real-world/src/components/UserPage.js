import React, { Component } from 'react'
import zip from 'lodash.zip'
import { connect } from 'thisy-react'
import { RouterA, UsersA, ReposA, StarredA } from '../store'
import User from './User'
import Repo from './Repo'
import List from './List'

export class UserPage extends Component {
  // static propTypes = {
  //   login: PropTypes.string.isRequired,
  //   user: PropTypes.object,
  //   paginationInfo: PropTypes.object,
  //   repos: PropTypes.array.isRequired,
  //   loadUserAndStarred: PropTypes.func.isRequired,
  //   loadMore: PropTypes.func.isRequired
  // }

  loadUserAndStarred = (login) => {
    const { send } = this.props
    send(UsersA.load, login)
    send(StarredA.load, login)
  }

  componentWillMount() {
    this.loadUserAndStarred(this.props.login)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== this.props.login) {
      this.loadUserAndStarred(nextProps.login)
    }
  }

  handleLoadMoreClick = () => {
    this.props.send(StarredA.load, this.props.login, true)
  }

  renderRepo([ repo, owner ]) {
    return (
      <Repo
        repo={repo}
        owner={owner}
        key={repo.fullName}
      />
    )
  }

  render() {
    const { user, login } = this.props
    if (!user) {
      return <h1><i>Loading {login}{"'s profile..."}</i></h1>
    }

    const { paginationInfo, repos } = this.props
    return (
      <div>
        <User user={user} />
        <hr />
        <List
          renderItem={this.renderRepo}
          items={repos}
          onLoadMoreClick={this.handleLoadMoreClick}
          loadingLabel={`Loading ${login}'s starred...`}
          {...paginationInfo /* pageCount, nextPageUrl, isFetching */}
        />
      </div>
    )
  }
}

const mapProps = send => ({ match }) => {
  const { login } = match.params
  const starredRepos = send(StarredA.get, login)
  const repoOwners = starredRepos.map(send.to(ReposA.getOwner))

  return {
    send,
    login,
    user: send(UsersA.get, login),
    repos: zip(starredRepos, repoOwners),
    paginationInfo: send(StarredA.getPagination, login),
  }
}

export default connect(UserPage, { mapProps })
