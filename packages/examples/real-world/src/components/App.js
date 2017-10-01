import React from 'react';
import { Router, Route } from 'react-router-dom';
import Header from './Header';
import UserPage from './UserPage';
import RepoPage from './RepoPage';

export default function App({ history }) {
  return (
    <Router history={history}>
      <div>
        <Header />
        <Route exact path="/:login" component={UserPage} />
        <Route path="/:login/:name" component={RepoPage} />
      </div>
    </Router>
  );
}
