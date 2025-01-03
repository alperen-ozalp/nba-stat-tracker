const pool = require('../db');  

const Team = {
  async getAllTeams() {
    const query = "SELECT * FROM team_info";
    const [rows] = await pool.query(query);
    console.log(rows)
    return rows;
  },

  async getTeamById(team_id) {
    const query = `SELECT 
    team_info.*, 
    team_stats.*, 
    team_rosters.*, 
    player_info.image,
    player_info.player_id FROM team_info
JOIN 
    (SELECT * 
     FROM team_stats 
     WHERE season = 2025) AS team_stats
    ON team_info.team_id = team_stats.team_id
JOIN 
    (SELECT * 
     FROM team_rosters) AS team_rosters
    ON team_info.team_id = team_rosters.team_id
JOIN 
    (SELECT player_id, image
     FROM player_info) AS player_info
    ON team_rosters.player_id = player_info.player_id
WHERE 
    team_info.team_id = ?`

    const [rows] = await pool.query(query, [team_id]);
    return rows;
  },


  async updateTeam(team_id, wins, loses, pts, ast, trb) {
    const query = `
      UPDATE team_stats 
      SET wins = ?, loses = ?, pts = ?, ast = ?,  trb = ? 
      WHERE team_id = ?
    `;
    const [result] = await pool.query(query, [wins, loses, pts, ast, trb, team_id]);
    return result.affectedRows;
  },
  async updateTeamRoster(team_id,player_id) {
    const querysel = `select abbreviation,full_name from team_info where team_id=?`;
    const [resultsel] = await pool.query(querysel, [team_id]);

    const query = `
      UPDATE team_rosters 
      SET team_id = ?,team_name = ?,abbreviation=?
      WHERE player_id = ?
      `;
    const [result] = await pool.query(query, [team_id,resultsel[0].team_name,resultsel[0].abbreviation,player_id]);

    const query0 = `
    UPDATE player_stats
    SET tm = ? 
    WHERE player_stats.player_id = ? AND player_stats.season = 2025
  `;
    const [result0] = await pool.query(query0, [resultsel[0].abbreviation,player_id]);

    const query1 = `
    UPDATE player_info
    SET team_id = ? 
    WHERE player_id = ?

  `;
    const [result1] = await pool.query(query1, [team_id,player_id]);

    return result.affectedRows;
  },
};

module.exports = Team;
