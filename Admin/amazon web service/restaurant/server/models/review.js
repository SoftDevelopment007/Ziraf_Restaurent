var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var reviewSchema = new Schema({
        zirafer_id: Number,
        rest_id: Number,
        rating: [Number],
        review: String,
        created_date: Date
    });
    reviewSchema.plugin(autoIncrement.plugin, 'Review');
    var Review = connection.model('Review', reviewSchema);

    return Review;
}