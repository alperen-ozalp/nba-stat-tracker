
const teamBusiness = require('../business/team'); 
const teamController = {
  async getAllTeams(req, res) {
    try {
      const teams = await teamBusiness.getAllTeams();
      res.render('teams', { title: 'Team List', user: req.session.username,teams: teams,layout: 'layouts/main' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
   

  },

  async getTeamById(req, res) {
    const { team_id } = req.params;

    try {
      const team = await teamBusiness.getTeamById(team_id);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      res.render('team', {
        title: 'Team Details',
        team: team,
        user: req.session.username,
        layout: 'layouts/main'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateTeam(req, res) {
    const { team_id } = req.params;

    try {
      const affectedRows = await teamBusiness.updateTeam(team_id, req.body);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Team not found' });
      }
        res.render('about', {
        user: req.session.username,
        title: "Team Stats Updated",
        layout: 'layouts/main'
      })
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },


async updateTeamRoster(req, res) {
  const { team_id } = req.params;

  try {
    const affectedRows = await teamBusiness.updateTeamRoster(team_id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }
      res.render('about', {
      user: req.session.username,
      title:"Team Roster Updated",
      layout: 'layouts/main'
    })
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
},

};


module.exports = teamController;
