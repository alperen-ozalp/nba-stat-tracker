const pool = require('../db');

const Player = {
  async getPlayerStats(playerID) {
    const query = `SELECT *
                   FROM player_stats,player_info  
                   WHERE player_id = ?`;
    const [stats] = await pool.query(query, [playerID]);
    return stats[0]; // Assuming the stats are returned as an array of one object
  },
  async getAllPlayers() {
    const query = 'SELECT * FROM player_info where team_id IS NOT NULL'
    const [rows] = await pool.query(query);
    return rows;
  },
  async getPlayer(playerID,season=2025) {
    const query = `SELECT * 
FROM player_info
right JOIN player_stats 
ON player_info.player_id = player_stats.player_id AND player_stats.season = ?
WHERE player_info.player_id = ?;
`;
    const [rows] = await pool.query(query, [season,playerID]);
    return rows;

  },
  async createPlayer(player_id, full_name, first_name, last_name, team_id) {
    const query = `
          INSERT INTO player_info ( player_id,full_name,first_name,	last_name,team_id) 
          VALUES (?, ?, ?, ?,?)
        `;
    const [result] = await pool.query(query, [player_id, full_name, first_name, last_name, team_id]);
    return result.insertId; // Return the ID of the new player
  },

  async updatePlayer(player_id,pts, ast, orb, drb, trb, stl, blk, fg_percent, ft_percent) {
    const query = `
          UPDATE player_stats 
          SET pts = ?, ast = ?,  orb = ?, drb = ? ,trb = ?,stl = ?,blk = ?,fg_percent = ?,ft_percent = ?
          WHERE player_stats.player_id = ?
        `;
    const [result] = await pool.query(query, [pts, ast, orb, drb, trb, stl, blk, fg_percent, ft_percent,player_id]);
    return result.affectedRows; // Return the number of affected rows
  },
  async deletePlayer(player_id) {
    const query = ` DELETE player_info
    FROM player_info
    WHERE player_info.player_id = ?;
    `;
    const [result] = await pool.query(query, [player_id]);
    return result.affectedRows; // Return the number of affected rows
  },

};
module.exports = Player;