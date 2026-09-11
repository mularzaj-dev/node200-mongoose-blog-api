const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// GET one user
router.get('/:id', (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send();
      }

      res.status(200).json(user);
    })
    .catch(err => {
      res.status(404).send();
    });
});

// CREATE user
router.post('/', (req, res) => {
  const newUser = new User(req.body);

  newUser.save()
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// UPDATE user
router.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(user => {
      if (!user) {
        return res.status(404).send();
      }

      res.status(204).send();
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// DELETE user
router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send();
      }

      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;