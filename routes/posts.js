const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// get all posts, newest first
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create a post
router.post('/', async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// like a post
router.patch('/:id/like', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// unlike a post
router.patch('/:id/unlike', async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, likes: { $gt: 0 } },
      { $inc: { likes: -1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found or has no likes' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;