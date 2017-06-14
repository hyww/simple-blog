const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true, default: 'Anonymous' },
  time: { type: Date, required: true, default: Date.now},
});

mongoose.model('PostModel', PostSchema);
if (process.env.DEV) {
  mongoose.connect('mongodb://localhost/simple-blog');
}
