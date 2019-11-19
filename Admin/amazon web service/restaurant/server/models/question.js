var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var questionSchema = new Schema({
        question: String,
        answer_id: Number
    });
    questionSchema.plugin(autoIncrement.plugin, 'Question');
    var Question = connection.model('Question', questionSchema);

    return Question;
}