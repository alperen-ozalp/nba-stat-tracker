// routes/user.js
const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/logout' ,UserController.logout );
module.exports = router;

