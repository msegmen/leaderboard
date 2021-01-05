var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserModelSchema = new Schema({
    rank: Number,
    points: {type: Number, default: 0, index: true},
    display_name: String,
    country: String,
}); 

UserModelSchema.index({points: 1});

module.exports = mongoose.model('User', UserModelSchema);