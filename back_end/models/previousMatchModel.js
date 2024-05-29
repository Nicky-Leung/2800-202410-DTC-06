const mongoose = require('mongoose');

const previousMatchSchema = new mongoose.Schema({
    sport: String,
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        name: String,
    },
    time: Date,
    date: Date,
    matchType: String,
    rank: String,
    elo: Number,
    score: {
        home: Number,
        away: Number
    },
    homePlayers: Array,
    awayPlayers: Array,
    timeLeft: Number,
});

// This is necessary to enable 2dsphere indexing for location
// createdMatchSchema.index({ location: '2dsphere' });

const previousmatchModel = mongoose.model('previous_matches', previousMatchSchema);

module.exports = previousmatchModel;