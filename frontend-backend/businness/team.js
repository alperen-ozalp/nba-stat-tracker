const Team = require('../models/team');

const teamBusiness = {
  async getAllTeams() {
    return await Team.getAllTeams();
  },

  async getTeamById(teamID) {
    if (!teamID) {
      throw new Error('Team ID is required');
    }
    return await Team.getTeamById(teamID);
  },

  async updateTeam(team_id, data) {
    const { wins,loses,pts,ast,trb} = data;


    return await Team.updateTeam(team_id,wins,loses,pts,ast,trb);
  },


  async updateTeamRoster(team_id, data) {
    const { player_id} = data;
    return await Team.updateTeamRoster(team_id,player_id);
  },

};


module.exports = teamBusiness;
