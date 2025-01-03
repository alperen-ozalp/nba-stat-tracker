const Player = require('../models/player');

const PlayerBusiness = {
    async getAllPlayers(){
      return await Player.getAllPlayers();

    },

    async getPlayer(player_id,season) {
    if (!player_id) {
      throw new Error('Player ID is required');
    }
    return await Player.getPlayer(player_id,season);
  },
  async createPlayer(data) {
    const { player_id,full_name,first_name,	last_name,team_id} = data;

    if (!player_id || !full_name || !first_name || !last_name || !team_id) {
      throw new Error('All fields are required');
    }

    return await Player.createPlayer(player_id,full_name,first_name,last_name,team_id);
  },
  async updatePlayer(player_id,data) {

    const { pts, ast, orb, drb, trb, stl, blk, fg_percent, ft_percent} = data;

    return await Player.updatePlayer(player_id,pts, ast, orb, drb, trb, stl, blk, fg_percent, ft_percent);
  },
  async deletePlayer(player_id) {
   

    return await Player.deletePlayer(player_id);
  },
};
module.exports = PlayerBusiness;