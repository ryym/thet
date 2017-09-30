import React from 'react'
import { Router, Route, Link } from 'react-router-dom'
import { connect } from 'thisy-react'
import { RouterA } from '../store'
import Header from './Header'
import UserPage from './UserPage'
import RepoPage from './RepoPage'

const GITHUB_REPO = 'https://github.com/ryym/thisy'

export default function App({ history }) {
  return (
    <Router history={history}>
      <div>
        <Header />
        <Route exact path="/:login" component={UserPage} />
        <Route path="/:login/:name" component={RepoPage} />
      </div>
    </Router>
  )
}
