var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var homeSchema = new Schema({
        photo: String
    });
    homeSchema.plugin(autoIncrement.plugin, 'Home');
    var Home = connection.model('Home', homeSchema);

    return Home;
}