var moment = require('moment');
var nodemailer = require('nodemailer');
var fs = require("fs");
var cfg = require('../config');
var fss = require('fs-extra');

module.exports = function(models) {
    var User = models.user;
    var Home = models.home;
    var Restaurant = models.restaurant;
    var UserRest = models.user_rest;
    var UserQue = models.user_que;
    var dataPro = require('./dataPro.js')();

    return {
        signup: function(req, res) {
            var body = req.body;
            User.findOne({ 'email': body.email }, function(err, user) {
                if (user) {
                    res.json({ 'success': false, 'error': 'The email is already existed.' });
                } else {
                    User.findOne({ 'name': body.name }, function(err, user) {
                        if (user) {
                            res.json({ 'success': false, 'error': 'The name is already existed.' });
                        } else {
                            var newUser = new User({
                                email: body.email,
                                password: dataPro.toHash(body.password),
                                type: body.type,
                                isAdmin: true,
                                name: body.name,
                                quote: '',
                                created_date: moment()
                            });
                            dataPro.saveUser(res, newUser, function(user) {
                                fss.copy('./upload/profile/avatar.png', './upload/profile/' + user._id + '.png', function(err) {
                                    if (err) {
                                        res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                    } else {
                                        Home.find({}, function(err, homes) {
                                            if (err) {
                                                res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                            } else {
                                                UserRest.find({ 'user_id': user._id }, function(err, user_rests) {
                                                    if (err) {
                                                        res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                                    } else {
                                                        if (user_rests.length == 0) {
                                                            res.json({ 'success': true, 'user': user, 'home': homes, 'user_rest': [] });
                                                        } else {
                                                            var ids = [];
                                                            for (var i = 0; i < user_rests.length; i++) {
                                                                ids.push(user_rests[i].rest_id);
                                                            }
                                                            Restaurant.find({ _id: { $in: ids } }, function(err, rests) {
                                                                if (err) {
                                                                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                                                } else {
                                                                    var temp = [];
                                                                    for (var i = 0; i < rests.length; i++) {
                                                                        temp.push({ id: rests[i]._id, name: rests[i].name });
                                                                    }
                                                                    res.json({ 'success': true, 'user': user, 'home': homes, 'user_rest': temp });
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
            });
        },
        login: function(req, res) {
            var body = req.body;
            User.findOne({ 'email': body.email }, function(err, user) {
                if (user && !user.isAdmin) {
                    if (dataPro.toHash(body.password) == user.password) {
                        dataPro.saveUser(res, user, function(user) {
                            Home.find({}, function(err, homes) {
                                if (err) {
                                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                } else {
                                    UserRest.find({ 'user_id': user._id }, function(err, user_rests) {
                                        if (err) {
                                            res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                        } else {
                                            if (user_rests.length == 0) {
                                                res.json({ 'success': true, 'user': user, 'home': homes, 'user_rest': [] });
                                            } else {
                                                var ids = [];
                                                for (var i = 0; i < user_rests.length; i++) {
                                                    ids.push(user_rests[i].rest_id);
                                                }
                                                Restaurant.find({ _id: { $in: ids } }, function(err, rests) {
                                                    if (err) {
                                                        res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                                    } else {
                                                        var temp = [];
                                                        for (var i = 0; i < rests.length; i++) {
                                                            temp.push({ id: rests[i]._id, name: rests[i].name });
                                                        }
                                                        UserQue.findOne({ user_id: user._id }, function(err, user_que) {
                                                            if (err) {
                                                                res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                                            } else {
                                                                if (user_que) {
                                                                    res.json({ 'success': true, 'user': user, 'home': homes, 'user_rest': temp, 'user_que': true });
                                                                } else {
                                                                    res.json({ 'success': true, 'user': user, 'home': homes, 'user_rest': temp, 'user_que': false });
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    } else {
                        res.json({ 'success': false, 'error': 'The user does not exist.' });
                    }
                } else {
                    res.json({ 'success': false, 'error': 'The user does not exist.' });
                }
            });
        },
        forgot_password: function(req, res) {
            var query = req.query;
            User.findOne({ 'email': query.email }, function(err, user) {
                if (user && !user.isAdmin) {
                    var transport = nodemailer.createTransport({
                        host: cfg.smtp_host,
                        secure: true,
                        auth: {
                            user: cfg.smtp_user,
                            pass: cfg.smtp_pass
                        }
                    });
                    var rand = Math.floor((Math.random() * 9000 + 999));
                    var mailOptions = {
                        from: cfg.smtp_sender,
                        to: req.query.email,
                        subject: 'Forgot Password!',
                        text: 'Please input four digit code to your app page.\nThe code is ' + rand + '.'
                    };
                    transport.sendMail(mailOptions, function(error, response) {
                        transport.close();
                        if (error) {
                            res.json({ 'success': false, 'error': 'Sorry! Check please your email address again.' });
                        } else {
                            res.json({ 'success': true, 'code': rand });
                        }
                    });
                } else {
                    res.json({ 'success': false, 'error': 'The user does not exist.' });
                }
            });
        },
        reset_password: function(req, res) {
            var body = req.body;
            User.findOne({ 'email': body.email }, function(err, user) {
                if (user && !user.isAdmin) {
                    user.password = dataPro.toHash(body.new_password);
                    dataPro.saveUser(res, user, function(user) {
                        res.json({ 'success': true });
                    });
                } else {
                    res.json({ 'success': false, 'error': 'The user does not exist.' });
                }
            });
        },
        change_profile: function(req, res) {
            var body = req.body;
            User.findOne({ '_id': body.id }, function(err, user) {
                if (user && !user.isAdmin) {
                    User.findOne({ 'name': body.name }, function(err, same_user) {
                        if (same_user && same_user._id != user._id) {
                            res.json({ 'success': false, 'error': 'The user is already existed.' });
                        } else {
                            var path = 'upload/profile/' + user._id + '.png';
                            fs.writeFile(path, body.file, 'base64', function(err) {
                                if (err) {
                                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                } else {
                                    user.name = body.name;
                                    user.quote = body.quote;
                                    dataPro.saveUser(res, user, function(user) {
                                        res.json({ 'success': true, 'user': user });
                                    });
                                }
                            });
                        }
                    });
                } else {
                    res.json({ 'success': false, 'error': 'The user does not exist.' });
                }
            });
        },
        change_photo: function(req, res) {
            var body = req.body;
            User.findOne({ '_id': body.id }, function(err, user) {
                if (user && !user.isAdmin) {
                    var path = 'upload/profile/' + user._id + '.png';
                    fs.writeFile(path, body.file, 'base64', function(err) {
                        if (err) {
                            res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                        } else {
                            dataPro.saveUser(res, user, function(user) {
                                res.json({ 'success': true });
                            });
                        }
                    });
                } else {
                    res.json({ 'success': false, 'error': 'The user does not exist.' });
                }
            });
        },
        set_favorite: function(req, res) {
            var body = req.body;
            UserRest.findOne({ 'user_id': body.user_id, 'rest_id': body.rest_id }, function(err, user_rest) {
                if (user_rest) {
                    user_rest.remove(function(err) {
                        if (err) {
                            res.json({ "success": false, 'error': 'Connection error. Please try again.' });
                        } else {
                            res.json({ 'success': true });
                        }
                    });
                } else {
                    var newUserRest = new UserRest({
                        user_id: body.user_id,
                        rest_id: body.rest_id
                    });
                    dataPro.saveThing(res, newUserRest, function(saved) {
                        res.json({ 'success': true });
                    });
                }
            });
        },
        get_favorite: function(req, res) {
            UserRest.find({ 'user_id': req.query.id }, function(err, user_rests) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    if (user_rests.length == 0) {
                        res.json({ 'success': true, 'user_rest': [] });
                    } else {
                        var ids = [];
                        for (var i = 0; i < user_rests.length; i++) {
                            ids.push(user_rests[i].rest_id);
                        }
                        Restaurant.find({ _id: { $in: ids } }, function(err, rests) {
                            if (err) {
                                res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                            } else {
                                var temp = [];
                                for (var i = 0; i < rests.length; i++) {
                                    temp.push({ id: rests[i]._id, name: rests[i].name });
                                }
                                res.json({ 'success': true, 'user_rest': temp });
                            }
                        });
                    }
                }
            });
        },
        get_user_rest: function(req, res) {
            UserRest.find({}, function(err, user_rests) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    res.json({ 'success': true, 'user_rest': user_rests });
                }
            });
        }
    }
}