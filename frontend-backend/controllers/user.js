// controllers/user.js
const UserBusiness = require('../business/user');
const session = require('express-session');

const UserController = {
  async authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = await UserBusiness.verifyToken(token);
      req.session.username = user.username;
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    next();
  },

  async register(req, res) {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const userId = await UserBusiness.register(username, password, role);
      res.render('about', { title: 'Register Successfull', user: req.session.username,layout: 'layouts/main' });

    } catch (error) {
      res.render('register', { title: 'User already Exist', user: req.session.username,layout: 'layouts/main' });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;
    console.log(req.body)
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
      
    }

    try {
      const { user } = await UserBusiness.login(username, password);
      req.session.username = user
      res.render('about', { title: 'Login Successfull', user: req.session.username,layout: 'layouts/main' });
    } catch (error) {
      res.render('login', {
      error: error,
      title: '',
      user: req.session.username,
      layout: 'layouts/main'
    });
    }
  },

  async logout(req, res) {
    try {
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.render('about', { title: 'Logout Successfull', user: 0,layout: 'layouts/main' });
    } catch (error) {
        console.error('Logout failed:', error); // Hata durumunda loglama
        res.status(500).json({ error: 'Failed to log out' });
    }
},
};

module.exports = UserController;
