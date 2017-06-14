import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
let server = '/';
if(process.env.NODE_ENV==='development')
  server = 'http://localhost:5000'

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
        <div className="bar">
          <Link className="newpost" to="/edit">
            發表文章
          </Link>
        </div>
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

class Post extends Component {
  constructor() {
    super();
    this.state = {
      status: 'Loading...',
    }
  }
  render() {
    let post;
    if(this.state.status !== 'loaded')
      post = this.state.status;
    else {
      const p = this.state.post;
      post = (
        <div className="article">
          <div className="header">
            <span className="author">
              {p.author}
            </span>
            <span className="title">
              {p.title}
            </span>
            <span className="time">
              {p.time}
            </span>
          </div>
          <div className="content">
            {p.content}
          </div>
        </div>
      );
    }
    return (
      <div>
        {post}
      </div>
    )
  }
  componentDidMount() {
    fetch(server + `/api/post?id=${this.props.match.params.postId}`).then(res=>{
      if(!res.ok)
        throw res.status;
      return res.json();
    }).then(json=>{
      this.setState({ status: 'loaded', post: json });
    }).catch(e=>{
      this.setState({ status: 'Load failed.' });
      console.log('Error: '+ e);
    });
  }
}
class Edit extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }
  render() {
    return (
      <div className="edit">
        <textarea
          ref="input"
          rows="22"
        ></textarea>
        <div className="bar">
          <Link className="newpost" to="/" onClick={this.onSubmit}>
            發表文章
          </Link>
        </div>
      </div>

    )
  }
  onSubmit() {
    fetch(server + '/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'test', // FIXME
        content: this.refs.input.value,
      })
    });
  }
}

class Blog extends Component {
  render() {
    return (
      <Router>
        <div className="main">
          <Route exact path="/" component={List}/>
          <Route path="/post/:postId" component={Post}/>
          <Route path="/edit" component={Edit}/>
        </div>
      </Router>
    );
  }
}

export default Blog;
