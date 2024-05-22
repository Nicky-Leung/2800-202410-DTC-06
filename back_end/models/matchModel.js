const mongoose = require('mongoose');

const createdMatchSchema = new mongoose.Schema({
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
});

// This is necessary to enable 2dsphere indexing for location
createdMatchSchema.index({ location: '2dsphere' });

const matchModel = mongoose.model('current_matches', createdMatchSchema);

module.exports = matchModel;