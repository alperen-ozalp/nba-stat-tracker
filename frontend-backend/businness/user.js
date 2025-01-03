const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const UserBusiness = {
  async register(username, password, role = 'normal') {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Validate role
    if (!['normal', 'admin'].includes(role)) {
      throw new Error('Invalid role. Use "normal" or "admin".');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({ username, password: hashedPassword, role });
  },

  async login(username, password) {
    const user = await User.findByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    return { user };
  },

  async verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },
};

module.exports = UserBusiness;
