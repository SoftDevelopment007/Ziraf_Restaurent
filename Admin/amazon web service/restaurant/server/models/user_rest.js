var mongoose = require('mongoose');
var moment = require('moment');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var userRestSchema = new Schema({
        user_id: Number,
        rest_id: Number
    });
    userRestSchema.plugin(autoIncrement.plugin, 'UserRest');
    var UserRest = connection.model('UserRest', userRestSchema);

    return UserRest;
}