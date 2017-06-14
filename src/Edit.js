import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { newline, pad } from './util.js';
import server from './server_config.js';
import './App.css';

class Edit extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.state = {
      state: 0,
      title:''
    }
  }
  render() {
    switch (this.state.state) {
      case 0:
      return (
        <div>
          {newline(20)}
          <div>發表文章於【<span className="f3"> Simple_Blog</span> 】 <span className="f6">Simple Blog</span> {pad(36,'看板',false)}</div>
          標題:<textarea defaultValue="title" className="f0 b7 inline" rows="1" cols="23"></textarea>
          {newline(2)}
          <span className="b7 f0">{pad(65)}<a className="link" onClick={this.setTitle}><span className="f1">(Enter)</span>確認 </a></span>
        </div>
      )
      case 1:
      return (
        <div className="edit">
          <textarea
            id="input"
            rows="23"
          ></textarea>
          <div><span className="b6 f4"> 編輯文章 </span><span className="b7"> <span className="f1">(^Z/F1)</span><span className="f0">說明</span><span className="f1"> (^P/^G)</span><span className="f0">插入符號/範本</span><Link className="link" to="/" onClick={this.onSubmit}><span className="f1"> (^X/^Q)</span><span className="f0">離開</span></Link><span className="f0">  ║插入│aipr║  ?:  ? </span></span></div>
        </div>
      )
      default:
    }
  }
  onSubmit() {
    fetch(server + '/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: this.state.title,
        content: document.querySelector('textarea').value,
      })
    });
  }
  setTitle() {
    this.setState({state: 1, title: document.querySelector('textarea').value});
  }
  onKeyDown(e) {
    switch(e.keyCode){
      case 88: //X
      case 81: //Q
        if(this.state.state===1 &&e.ctrlKey) {
          this.onSubmit();
          this.props.history.push('/');
          e.preventDefault();
        }
        break;
      case 13:
        if(this.state.state===0) {
          this.setTitle();
          e.preventDefault();
        }
        break;
      default:
    }
  }
  componentDidMount() {
    document.querySelector('textarea').focus();
    document.addEventListener('keydown', this.onKeyDown, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }
  componentDidUpdate() {
    document.querySelector('textarea').focus();
  }
}
export default Edit;
