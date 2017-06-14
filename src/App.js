import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import './App.css';
let server = '';
if(process.env.NODE_ENV==='development')
  server = 'http://localhost:5000'
function newline(n) {
  return new Array(n+1).join('\n');
}
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
      cursor: 19
    }
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }
  onClick() {
    this.props.history.push('/test');
  }
  render() {
    let posts;
    if(this.state.status !== 'loaded')
      posts = this.state.status+newline(20);
    else {
      const p = parseInt(this.props.match.params.p, 0);
      let start = this.state.posts.length - p - 19;
      const cursor = this.state.cursor;
      console.log([this.state.posts.length, start]);
      if(p <1)
        posts = (
          <Redirect to="/p/1" />
        )
      else if(start < 0 && this.state.posts.length > 19) {
        posts = (
          <Redirect to={`/p/${this.state.posts.length - 19}`} />
        )
      }
      else {
        posts = this.state.posts.slice(start, start+20).map((p,i)=>(
          <Link className={`row link ${cursor===i?'cursor':''}`} to={`/post/${p._id}`} key={p._id}>
            <span className="index">
              {(cursor===i?'>':'')+pad(7, start + i + 1, true)}
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
        posts.push(newline(20-(this.state.posts.slice(start, start+20).length)));
      }
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
  onKeyDown(e) {
    let cursor = this.state.cursor;
    const p = parseInt(this.props.match.params.p, 0);
    let offset = 1;
    switch(e.keyCode){
      case 35: //end
        offset*= 10000;
      case 34: //pgdn
        offset*= 20;
      case 40: //down
        cursor+=offset;
        if(cursor > 19){
          this.props.history.replace(`/p/${p - offset}`)
          cursor = 19;
        }
        break;
      case 39: //right
        document.querySelector('.cursor').click();
        break;
      case 36: //home
        offset*= 10000;
      case 33: //pgup
        offset*= 20;
      case 38: //up
        cursor-=offset;
        if(cursor < 0){
          this.props.history.replace(`/p/${p + offset}`)
          cursor = 0;
        }
        break;
      case 37: //left
        break;
      default:
    }
    this.setState({ cursor });
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
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
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
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
      post = this.state.status+newline(23);
    else {
      const p = this.state.post;
      post = (
        <div className="article">
          <div>
            <span className="b7 f4"> 作者 </span>
            <span className="b4 f7">{pad(52,' '+p.author, false)}</span>
            <span className="b7 f4"> 看板 </span>
            <span className="b4 f7"> Simple_Blog </span>
          </div>
          <div>
            <span className="b7 f4"> 標題 </span>
            <span className="b4 f7">{pad(71,' '+p.title, false)}</span>
          </div>
          <div>
            <span className="b7 f4"> 時間 </span>
            <span className="b4 f7">{pad(71,' '+(new Date(p.time)).toLocaleString(), false)}</span>
          </div>
          <div className="f6">───────────────────────────────────────</div>
          <textarea
            rows="19"
            value={p.content}
            readOnly
          ></textarea>
        </div>
      );
    }
    return (
      <div>
        {post}
        <div><span className="b4 f7">  瀏覽 第 ?/? 頁 (???%) </span><span className="b7 f0 hl"> 目前顯示: 第 ??~?? 行 </span><span className="b7"> <span className="f1">(y)</span><span className="f0">回應</span><span className="f1">(X%)</span><span className="f0">推文</span><span className="f1">(h)</span><span className="f0">說明</span><span className="f1">(←)</span><span className="f0">離開   </span></span></div>
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
          rows="23"
        ></textarea>
        <div><span className="b6 f4"> 編輯文章 </span><span className="b7"> <span className="f1">(^Z/F1)</span><span className="f0">說明</span><span className="f1"> (^P/^G)</span><span className="f0">插入符號/範本</span><Link className="link" to="/" onClick={this.onSubmit}><span className="f1"> (^X/^Q)</span><span className="f0">離開</span></Link><span className="f0">  ║插入│aipr║  ?:  ? </span></span></div>
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
