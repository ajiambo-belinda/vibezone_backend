const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorName: { type: String, required: true },
  location: { type: String, default: '' },
  caption: { type: String, default: '' },
  image: { type: String, default: '' },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);