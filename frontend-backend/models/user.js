// models/user.js
const pool = require('../db');

const User = {
  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await pool.query(query, [username]);
    return rows[0];
  },

  async create(userData) {
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    const [result] = await pool.query(query, [userData.username, userData.password, userData.role]);
    return result.insertId;
  },

  async getUserById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  },
};

module.exports = User;

