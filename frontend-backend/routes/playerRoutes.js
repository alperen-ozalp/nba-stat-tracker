const PlayerController = require('../controllers/player');


const express = require('express');

const router = express.Router();

router.get('/' ,PlayerController.getAllPlayers);
router.get('/:player_id' ,PlayerController.getPlayer );
router.post('/create', PlayerController.createPlayer);
router.put('/update/:player_id',PlayerController.updatePlayer );
router.get('/delete/:player_id' ,PlayerController.deletePlayer);
router.post('/delete/:player_id' ,PlayerController.deletePlayer);






module.exports = router;