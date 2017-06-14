import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import './App.css';
let server = '/';
if(process.env.NODE_ENV==='development')
  server = 'http://localhost:5000'
function pad(n, s, f) {
  if(typeof s !== 'undefined') {
    if(f)
      return (new Array(n+1).join(' ') + s).slice(-n);
    else
      return (s + new Array(n+1).join(' ')).slice(0, n);
  }

  return new Array(n+1).join(' ');
}
class List extends Component {
  constructor() {
    super();
    this.state = {
      status: 'Loading...',
    }
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    this.props.history.push('/test');
  }
  render() {
    let posts;
    if(this.state.status !== 'loaded')
      posts = this.state.status;
    else {
      const p = this.props.match.params.p;
      let start = this.state.posts.length - p - 19;
      console.log([this.state.posts.length, start]);
      if(start < 0)
        posts = (
          <Redirect to={`/p/${this.state.posts.length - 19}`} />
        )
      else
      posts = this.state.posts.slice(start, start+20).map((p,i)=>(
        <Link className="row link" to={`/post/${p._id}`} key={p._id}>
          <span className="index">
            {pad(7, start + i + 1, true)}
          </span>
          <span className="date">
            {(d=>pad(6,d.getMonth(),true)+'/'+pad(2,d.getDate(),true)+' ')(new Date(p.time))}
          </span>
          <span className="author">
            {pad(13,p.author,false)}
          </span>
          <span className="title">
            {'□ '+p.title}
          </span>
        </Link>
      ));
    }
    return (
      <div className="list">
        <div className="b6 hl">【板主:Anonymous】{pad(16)}<span className="hl f3">Simple Blog</span>{pad(16)}看板《Simple_Blog》</div>
        [←]離開 [→]閱讀 <Link className="link" to="/edit">[Ctrl-P]發表文章</Link> [d]刪除 [z]精華區 [i]看板資訊/設定 [h]說明 
        <div className="b7 f0">   編號    日 期 作  者       文  章  標  題                           人氣:?  </div>
        {posts}
        <div><span className="b6 f4"> 文章選讀 </span><span className="b7"> <span className="f1">(y)</span><span className="f0">回應</span><span className="f1">(X)</span><span className="f0">推文</span><span className="f1">(^X)</span><span className="f0">轉錄</span><span className="f1"> (=[]&lt;&gt;)</span><span className="f0">相關主題</span><span className="f1">(/?a)</span><span className="f0">找標題/作者</span><span className="f1"> (b)</span><span className="f0">進板畫面  </span></span></div>
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
        <div className="bbs">
          <Switch>
            <Route path="/p/:p" component={List}/>
            <Route path="/post/:postId" component={Post}/>
            <Route path="/edit" component={Edit}/>
            <Redirect to="/p/1" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Blog;
