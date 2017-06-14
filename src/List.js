import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { newline, pad } from './util.js';
import server from './server_config.js';

class List extends Component {
  constructor() {
    super();
    this.state = {
      status: 'Loading...',
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
      const p = parseInt(this.props.match.params.p, 10);
      let start = this.state.posts.length - p - 19;
      const cursor = parseInt(this.props.match.params.c, 10);
      if(p <1)
        posts = (
          <Redirect to={`/p/1/${cursor}`} />
        )
      else if(start < 0 && this.state.posts.length > 19) {
        posts = (
          <Redirect to={`/p/${this.state.posts.length - 19}/${cursor}`} />
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
    const p = parseInt(this.props.match.params.p, 10);
    let cursor = parseInt(this.props.match.params.c, 10);
    let offset = 1;
    switch(e.keyCode){
      case 80: //p
        if(e.ctrlKey) {
          this.props.history.push('/edit');
          e.preventDefault();
        }
        return;
      case 35: //end
        offset*= 10000;
      case 34: //pgdn
        offset*= 20;
      case 40: //down
        cursor+=offset;
        if(cursor > 19){
          this.props.history.replace(`/p/${p - offset}/19`)
          return;
        }
        break;
      case 39: //right
        document.querySelector('.cursor').click();
        return;
      case 36: //home
        offset*= 10000;
      case 33: //pgup
        offset*= 20;
      case 38: //up
        cursor-=offset;
        if(cursor < 0){
          this.props.history.replace(`/p/${p + offset}/0`)
          return;
        }
        break;
      case 37: //left
        break;
      default:
    }
    this.props.history.replace(`/p/${p}/${cursor}`)
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
export default List;
