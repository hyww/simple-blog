import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
const server = 'http://localhost:5000'

class List extends Component {
  constructor() {
    super();
    this.state = {
      status: 'Loading...',
    }
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    this.context.router.push('/test');
  }
  render() {
    let posts;
    if(this.state.status !== 'loaded')
      posts = this.state.status;
    else {
      posts = this.state.posts.map((p,i)=>(
        <Link className="link" to={`/post/${p._id}`} key={p._id}>
          <span className="index">
            {i+1}
          </span>
          <span className="author">
            {p.author}
          </span>
          <span className="title">
            {p.title}
          </span>
        </Link>
      ));
    }
    return (
      <div className="list">
        {posts}
      </div>
    )
  }
  componentDidMount() {
    console.log('mounted');
    fetch(server + '/api/posts').then(res=>{
      if(!res.ok)
        throw res.status;
      return res.json();
    }).then(json=>{
      this.setState({ status: 'loaded', posts: json });
    }).catch(e=>{
      this.setState({ status: 'Load failed.' });
      console.log('Error: '+ e);
    });
  }
}

class Blog extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={List}/>
      </Router>
    );
  }
}

export default Blog;
