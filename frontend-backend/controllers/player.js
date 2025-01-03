const PlayerBusiness = require('../business/player');


let teamA = [];
let teamB = [];

const PlayerController = {

    async getAllPlayers(req, res) {
        try {
          const results = await PlayerBusiness.getAllPlayers();
          res.render('players', {
            title: 'Players List',
            players: results, 
            user: req.session.username,
            layout: 'layouts/main'
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    },
    async getPlayer(req, res) {
        const player_id = req.params.player_id;
        const season = req.query.season || 2025;  // Default to 2025 if no season is selected
    
        try {
          const player = await PlayerBusiness.getPlayer(player_id,season);
          if (!player) {
            return res.status(404).json({ message: 'Player not found' });
          }
          const stats = player.map(row => ({
            name: row.stat_name,
            value: row.stat_value
          }));
          res.render('player', {
            title: 'Player Stats',
            player: player[0],
            season: season,
            user: req.session.username,
            stats: stats, 
            layout: 'layouts/main'
          });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      },
      async createPlayer(req, res) {
        try {
          const playerID = await PlayerBusiness.createPlayer(req.body);
          res.render('about', {
            user: req.session.username,
            title: 'Player Updated',
            layout: 'layouts/main'
          });
        } catch (error) {
          res.render('about', {
            user: req.session.username,
            title: 'Player ID Already Exist',
            layout: 'layouts/main'
          });
        }
      },
      async updatePlayer(req, res) {
        const { player_id } = req.params;
    
        try {
          const affectedRows = await PlayerBusiness.updatePlayer(player_id, req.body);
          if (affectedRows === 0) {
            return res.status(404).json({ message: 'Player not found' });
          }
          res.render('about', {
            user: req.session.username,
            title: 'Player Updated',
            layout: 'layouts/main'
          })
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      },
      async deletePlayer(req, res) {
        const { player_id } = req.params;
    
        try {
          const affectedRows = await PlayerBusiness.deletePlayer(player_id);
          if (affectedRows === 0) {
            return res.status(404).json({ message: 'Player not found' });
          }
          res.render('about', {
            user: req.session.username,
            title: 'Player deleted',
            layout: 'layouts/main'
          });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      },
}
module.exports = PlayerController;
