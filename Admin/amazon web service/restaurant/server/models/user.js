var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var userSchema = new Schema({
        email: String,
        password: String,
        name: String,
        isAdmin: Boolean,
        type: String,
        quote: String,
        created_date: Date,
        updated_date: Date
    });
    userSchema.plugin(autoIncrement.plugin, 'User');
    var User = connection.model('User', userSchema);

    return User;
}