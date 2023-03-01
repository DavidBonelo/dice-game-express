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

    if (!errors.isEmpty()) {
      res.render('game_create', {
        title: 'New game',
        players: req.body.players,
        errors: errors.array()
      })
    } else {
      // continue after validation found no errors

      let players = [];
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


exports.startGame = (req, res, next) => {

}

exports.winner = (req, res, next) => {

}

exports.gameList = (req, res, next) => {

}

exports.playerList = (req, res, next) => {

}