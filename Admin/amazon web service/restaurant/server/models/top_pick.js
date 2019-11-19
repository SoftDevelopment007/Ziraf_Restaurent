var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var topPickSchema = new Schema({
        zirafer_id: Number,
        rest_id: Number,
        description: String,
        created_date: Date
    });
    topPickSchema.plugin(autoIncrement.plugin, 'TopPick');
    var TopPick = connection.model('TopPick', topPickSchema);

    return TopPick;
}