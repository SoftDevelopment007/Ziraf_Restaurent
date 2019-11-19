var moment = require('moment');
var crypto = require('crypto');

module.exports = function() {
    return {
        saveUser: function(res, user, next) {
            user.updated_date = moment();
            user.save(function (err, user) {
                if(err) {
                    res.json({'success': false, 'error': 'Connection error. Please try again.'});
                } else {
                    return next(user);
                }
            });
        },

        saveThing: function(res, newThing, next) {
            newThing.save(function(err, thing) {
                if (err) {
                    res.json({'success': false, 'error': 'Connection error. Please try again.'});
                } else {
                    next(thing);
                }
            });
        },

        toHash: function(pass) {
            var shasum = crypto.createHash('sha1');
            shasum.update(pass);
            return shasum.digest('hex');
        }
    }
}