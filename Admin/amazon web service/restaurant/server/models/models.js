module.exports = function(connection) {
    var user = require('./user')(connection);
    var category = require('./category')(connection);
    var user_rest = require('./user_rest')(connection);
    var restaurant = require('./restaurant')(connection);
    var review = require('./review')(connection);
    var zirafer = require('./zirafer')(connection);
    var question = require('./question')(connection);
    var home = require('./home')(connection);
    var user_que = require('./user_que')(connection);
    var top_pick = require('./top_pick')(connection);

    return {
        user: user,
        category: category,
        user_rest: user_rest,
        restaurant: restaurant,
        review: review,
        zirafer: zirafer,
        question: question,
        home: home,
        user_que: user_que,
        top_pick: top_pick
    }
}