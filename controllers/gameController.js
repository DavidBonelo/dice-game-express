const Game = require('../models/game');
const Player = require('../models/player');
const mongoose = require('mongoose');
const { body, validationResult } = require("express-validator");
const async = require('async');

// render the lobby view with the list of games in progress
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

// render the create game view
exports.createGameGet = (req, res, next) => {
  res.render('game_create', {
    title: 'New game'
  });
}

// validate input, create game and players in the db and render the game detail view
exports.createGamePost = [
  // Convert the players to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.players)) {
      req.body.players =
        typeof req.body.players === "undefined" ? [] : [req.body.players];
    }
    next();
  },
  // Validate and sanitize fields.
  body("players.*", "Player name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // re-render the form if input contains errors
    if (!errors.isEmpty()) {
      res.render('game_create', {
        title: 'New game',
        players: req.body.players,
        errors: errors.array()
      })
    } else {
      // continue after validation found no errors
      let players = [];
      // syncronusly create or use players if already exists
      async.eachSeries(
        req.body.players, async (player) => {
          const foundPlayer = await Player.findOne({ name: player })

          if (foundPlayer) {
            players.push(foundPlayer);
          } else {
            const newPlayer = new Player({
              name: player
            });
            await newPlayer.save();
            players.push(newPlayer);
          }
        }, (err) => {
          // after searching every player in the db
          if (err) {
            console.log(err);
            next(err);
          }
          // create and save the new game into the db
          const game = new Game({
            inProgress: true,
            gamers: players
          });
          game.save();

          res.redirect(game.url);
        })
    }
  }
]
// find the game and render game_detail view
exports.gameDetail = (req, res, next) => {
  Game.findById(req.params.id).populate('gamers').populate('winner').exec((err, game) => {
    if (!game) {
      res.redirect('/');
    }
    else {
      res.render('game_detail', {
        title: 'Game details',
        game: game
      })
    }
  });
}

exports.startGame = [
  // Convert the rolls to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.rolls)) {
      req.body.rolls =
        typeof req.body.rolls === "undefined" ? [] : [req.body.rolls];
    }
    next();
  },
  // Validate and sanitize fields.
  body("rolls.*")
    .trim()
    .isNumeric()
    .escape()
    .withMessage("Player roll must be numeric, and not empty.")
    .isInt({ min: 1, max: 6 })
    .withMessage("Roll value invalid (must be between 1 and 6)"),

  body("gameid", "Invalid gameid")
    .trim()
    .escape()
    .isMongoId(),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    Game.findById(req.body.gameid).populate('gamers').exec((err, game) => {
      if (err) next(err);
      // check if input has errors, or the game has already finalized or the game wasn't found
      if (!errors.isEmpty() || !game.inProgress || game == null) {
        res.render('game_detail', {
          title: 'Game details',
          game: game,
          rolls: req.body.rolls
        });
      } else {
        // continue after validation found no errors
        const maxRoll = Math.max(...req.body.rolls).toString();
        const winnerIndex = req.body.rolls.indexOf(maxRoll);
        const winner = game.gamers[winnerIndex];
        // update game status and winner
        game.winner = winner._id;
        game.inProgress = false;
        game.save();
        // update player gamesWon
        Player.findByIdAndUpdate(winner._id, { gamesWon: winner.gamesWon + 1 }, {})
          .catch(err => console.log('player update error', err));

        res.redirect(game.url + '/winner');

      }
    })
  }
]
// same as gameDetail (:
exports.winner = (req, res, next) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  Game.findById(id).populate('gamers').populate('winner').exec((err, game) => {
    if (err) next(err);
    if (game == null) res.redirect('/')
    res.render('game_detail', {
      title: 'Game details',
      game: game
    })
  });
}
// get all the games, sort them and render game_list
exports.gameList = (req, res, next) => {
  Game.find({}).populate('gamers').populate('winner')
    .sort([['inProgress', 'descending'], ['creationDate', 'descending']])
    .exec((err, games) => {
      if (err) next(err);

      res.render('game_list', {
        title: 'Games history: ',
        games: games.length < 1 ? null : games
      })
    });

}
// get all the players, sort them and render game_list
exports.playerList = (req, res, next) => {
  Player.find({}).sort([['gamesWon', 'descending']]).exec((err, players) => {
    if (err) next(err);

    res.render('player_list', {
      title: 'List of players',
      players: players.length < 1 ? null : players
    })
  });

}