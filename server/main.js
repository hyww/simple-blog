// mongoose setup
const mongoose = require('mongoose');
require('./db')
const Post = mongoose.model('PostModel');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('build'));

if (process.env.DEV) {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
}

app.get('/api/posts', (req, res) => {
  var query = Post.find({});
  query.select('title time author');
  query.sort({ time: 1 });

  query.exec((err, posts) => {
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

