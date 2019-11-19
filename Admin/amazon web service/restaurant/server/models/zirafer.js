var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var ziraferSchema = new Schema({
    	name: String,
        profession: String,
        quote: String,
        social_link: [String],
        created_date: Date
    });
    ziraferSchema.plugin(autoIncrement.plugin, 'Zirafer');
    var Zirafer = connection.model('Zirafer', ziraferSchema);

    return Zirafer;
}