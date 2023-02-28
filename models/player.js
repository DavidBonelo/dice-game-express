const { default: mongoose, model } = require("mongoose");

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: { type: String, required: true, minLenght: 3, maxLenght: 50 },
    gamesWon: { type: Number, default: 0 }
});

module.exports = model('Player', playerSchema);