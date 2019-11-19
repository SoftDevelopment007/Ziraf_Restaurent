var mongoose = require('mongoose');
var moment = require('moment');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var categorySchema = new Schema({
        name: String,
        type: String,
        parent_id: Number
    });
    categorySchema.plugin(autoIncrement.plugin, 'Category');
    var Category = connection.model('Category', categorySchema);

    return Category;
}