import React, { Component } from 'react';
import { newline, pad } from './util.js';
import server from './server_config.js';

class Post extends Component {
  constructor() {
    super();
    this.state = {
      status: 'Loading...',
    }
    this.onKeyDown = this.onKeyDown.bind(this);
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
        <div><span className="b4 f7">  瀏覽 第 ?/? 頁 (???%) </span><span className="b7 f0 hl"> 目前顯示: 第 ??~?? 行 </span><span className="b7"> <span className="f1">(y)</span><span className="f0">回應</span><span className="f1">(X%)</span><span className="f0">推文</span><span className="f1">(h)</span><span className="f0">說明</span><a className="link" onClick={()=>{this.props.history.goBack()}}><span className="f1">(←)</span><span className="f0">離開   </span></a></span></div>
      </div>
    )
  }
  onKeyDown(e) {
    switch(e.keyCode){
      case 37: //left
        this.props.history.goBack();
        break;
      default:
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
    fetch(server + `/api/post?id=${this.props.match.params.postId}`).then(res=>{
      if(!res.ok)
        throw res.status;
      return res.json();
    }).then(json=>{
      this.setState({ status: 'loaded', post: json });
      document.querySelector('textarea').focus();
    }).catch(e=>{
      this.setState({ status: 'Load failed.' });
      console.log('Error: '+ e);
    });
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }
}

export default Post;
