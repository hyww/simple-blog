import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import List from './List.js';
import Post from './Post.js';
import Edit from './Edit.js';
import './App.css';

class Blog extends Component {
  render() {
    return (
      <Router>
        <div className="bbs">
          <Switch>
            <Route path="/p/:p/:c" component={List}/>
            <Route path="/post/:postId" component={Post}/>
            <Route path="/edit" component={Edit}/>
            <Redirect to="/p/1/19" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Blog;
