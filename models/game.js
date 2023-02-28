const { default: mongoose, model } = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    inProgress: Boolean,
    gamers: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    winner: { type: Schema.Types.ObjectId, ref: 'Player' },
    creationDate: { type: Date, default: Date.now }
});

gameSchema.virtual('url').get(function () {
    return '/game/' + this._id
});

module.exports = model('Game', gameSchema);