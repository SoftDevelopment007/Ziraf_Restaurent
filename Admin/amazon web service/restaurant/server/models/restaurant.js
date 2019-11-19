var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var restaurantSchema = new Schema({
        name: String,
        rating: Number,
        street_name: String,
        location: [Number],
        pictures: [String],
        price: Number,
        phone_number: String,
        opening_hours: [String],
        category_id: [Number]
    });
    restaurantSchema.plugin(autoIncrement.plugin, 'Restaurant');
    var Restaurant = connection.model('Restaurant', restaurantSchema);

    return Restaurant;
}