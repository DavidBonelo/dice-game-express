const Game = require('../models/game');
const Player = require('../models/player');

exports.lobby = function (req, res, next) {
  
  Game.find({ inProgress: true })
    .populate("gamers")
    .then((games) => {
      res.render('lobby', {
        title: 'Dice game',
        games: games.length > 0 ? games : null,
      });
    }).catch((err) => console.log(err));
}

exports.createGameGet = (req, res, next) => {
  res.render('game_create', {
    title: 'New game'
  });
}

exports.createGamePost = (req, res, next) => {

}

exports.gameDetail = (req, res, next) => {

}

exports.startGame = (req, res, next) => {

}

exports.winner = (req, res, next) => {

}

exports.gameList = (req, res, next) => {

}

exports.playerList = (req, res, next) => {

}