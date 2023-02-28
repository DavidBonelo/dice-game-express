const express = require('express');
const router = express.Router();

const lobbyController = require('../controllers/gameController.js')

router.get('/', lobbyController.lobby);
router.get('/createGame', lobbyController.createGameGet);
router.post('/createGame', lobbyController.createGamePost);
router.get('/games', lobbyController.gameList);
router.get('/players', lobbyController.playerList);
router.get('/game/:id', lobbyController.gameDetail);
router.post('/startGame', lobbyController.startGame);
router.get('/game/:id/winner', lobbyController.winner);

module.exports = router;
