var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

module.exports = function(connection) {
    var Schema = mongoose.Schema;
    autoIncrement.initialize(connection);

    var userQueSchema = new Schema({
        user_id: Number,
        answers: [{
            que_id: Number,
            ans_num: [Number]
        }]
    });
    userQueSchema.plugin(autoIncrement.plugin, 'UserQue');
    var UserQue = connection.model('UserQue', userQueSchema);

    return UserQue;
}