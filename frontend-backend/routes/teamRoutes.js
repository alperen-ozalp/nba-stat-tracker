const teamController = require('../controllers/team');

const express = require('express');

const router = express.Router();

router.get('/' ,teamController.getAllTeams);
router.get('/:team_id' ,teamController.getTeamById );
router.post('/update/:team_id',teamController.updateTeam );
router.post('/updateroster/:team_id',teamController.updateTeamRoster );


module.exports = router;