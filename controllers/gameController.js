const Game = require('../models/game');
const Player = require('../models/player');

exports.lobby = function (req, res, next) {
  res.send('lobby')
}
