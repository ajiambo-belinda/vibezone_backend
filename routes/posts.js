const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { uploadImage, uploadToCloudinary } = require('../utils/upload');

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

router.post('/', auth, uploadImage, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const { location, caption } = req.body;
    let image = req.body.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      image = result.secure_url;
    }

    const post = await Post.create({
      authorName: user.name,
      author: user._id,
      location,
      caption,
      image
    });
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