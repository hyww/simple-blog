// mongoose setup
const mongoose = require('mongoose');
require('./db')
const Post = mongoose.model('PostModel');
new Post({ title: 'test', content: 'Hello World!', author: 'hyww'}).save();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('build'));

if (process.env.DEV) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
}

app.get('/api/posts', (req, res) => {
  Post.find({}, 'title time author', (err, posts) => {
    if(err)
      res.status(500).send({ error: 'Get posts failed!' });
    else {
      res.json(posts);
    }
  });
});

app.get('/api/post', (req, res) => {
  Post.findById(req.query.id, (err, post) => {
    if(err)
      res.status(500).send({ error: `Get post ${req.query.id} failed!` });
    else {
      res.json(post);
    }
  });
});

app.post('/api/post', (req, res) => {
  console.log(req.body);
  new Post(req.body).save((err) => {
    if(err)
      res.status(500).send({ error: `New post failed!` });
    else {
      res.send({ status: 'done' });
    }
  });
});
app.listen(process.env.PORT || 5000);

