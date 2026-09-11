const express = require('express');
const router = express.Router();

const Blog = require('../models/Blog');
const User = require('../models/User');

// GET all blogs
router.get('/', (req, res) => {
  Blog.find()
    .then(blogs => {
      res.status(200).json(blogs);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// GET featured blogs
router.get('/featured', (req, res) => {
  Blog.find({ featured: true })
    .then(blogs => {
      res.status(200).json(blogs);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// GET one blog
router.get('/:id', (req, res) => {
  Blog.findById(req.params.id)
    .then(blog => {
      if (!blog) {
        return res.status(404).send();
      }

      res.status(200).json(blog);
    })
    .catch(err => {
      res.status(404).send();
    });
});

// CREATE blog and associate it with a user
router.post('/', (req, res) => {
  let dbUser;
  let dbBlog;

  const userId = req.body.author || req.body.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send();
      }

      dbUser = user;

      const newBlog = new Blog(req.body);
      newBlog.author = user._id;

      return newBlog.save();
    })
    .then(blog => {
      if (!blog) return;

      dbBlog = blog;

      dbUser.blogs.push(blog._id);

      return dbUser.save();
    })
    .then(() => {
      if (dbBlog) {
        res.status(201).json(dbBlog);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err);
    });
});

// UPDATE blog
router.put('/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body)
    .then(blog => {
      if (!blog) {
        return res.status(404).send();
      }

      res.status(204).send();
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// DELETE blog
router.delete('/:id', (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(blog => {
      if (!blog) {
        return res.status(404).send();
      }

      res.status(200).json(blog);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;