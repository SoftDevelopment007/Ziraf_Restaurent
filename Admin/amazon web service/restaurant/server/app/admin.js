var fs = require("fs");
var moment = require('moment');

module.exports = function(models) {
    var User = models.user;
    var UserRest = models.user_rest;
    var UserQue = models.user_que;
    var Restaurant = models.restaurant;
    var Question = models.question;
    var Category = models.category;
    var Home = models.home;
    var dataPro = require('./dataPro.js')(models);
    var getUser = function(res) {
        User.find({ isAdmin: false }, function(err, content) {
            if (err) {
                res.json({ 'success': false });
            } else {
                res.json({ 'success': true, 'info': content });
            }
        });
    };
    var getHome = function(res) {
        Home.find({}, function(err, content) {
            if (err) {
                res.json({ 'success': false });
            } else {
                res.json({ 'success': true, 'info': content });
            }
        });
    };

    return {
        //admin
        login: function(req, res) {
            var body = req.body;
            User.findOne({ email: body.email }, function(err, admin) {
                if (admin && admin.isAdmin) {
                    if (admin.password == dataPro.toHash(body.password)) {
                        admin.quote = Math.floor((Math.random() * 9000 + 999));
                        dataPro.saveUser(res, admin, function(user) {
                            res.json({ 'success': true, 'token': user.quote });
                        });
                    } else {
                        res.json({ 'success': false });
                    }
                } else {
                    res.json({ 'success': false });
                }
            });
        },
        isValid: function(req, res) {
            User.findOne({ isAdmin: true }, function(err, admin) {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    if (admin.quote == req.query.token) {
                        res.json({ 'success': true });
                    } else {
                        res.json({ 'success': false });
                    }
                }
            });
        },
        reset: function(req, res) {
            var body = req.body;
            User.findOne({ password: dataPro.toHash(body.oldPassword), email: body.oldEmail }, function(err, admin) {
                if (admin && admin.isAdmin) {
                    admin.email = body.email;
                    admin.password = dataPro.toHash(body.password);
                    dataPro.saveUser(res, admin, function(user) {
                        res.json({ 'success': true });
                    });
                } else {
                    res.json({ 'success': false });
                }
            });
        },

        get_user: function(req, res) {
            getUser(res);
        },
        get_user_info: function(req, res) {
            var id = req.query.id;
            User.findOne({ _id: id }, function(err, user) {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    UserRest.find({ user_id: id }, function(err, user_rests) {
                        if (err) {
                            res.json({ 'success': false });
                        } else {
                            var rest_ids = [];
                            if (user_rests) {
                                for (var i = 0; i < user_rests.length; i++) {
                                    rest_ids.push(user_rests[i].rest_id);
                                }
                            }
                            Restaurant.find({ _id: { $in: rest_ids } }, function(err, rests) {
                                if (err) {
                                    res.json({ 'success': false });
                                } else {
                                    UserQue.findOne({ user_id: id }, function(err, user_que) {
                                        if (err) {
                                            res.json({ 'success': false });
                                        } else {
                                            var cat_ids = [];
                                            if (user_que) {
                                                for (var i = 0; i < user_que.answers.length; i++) {
                                                    for (var j = 0; j < user_que.answers[i].ans_num.length; j++) {
                                                        cat_ids.push(user_que.answers[i].ans_num[j]);
                                                    }
                                                }
                                            }
                                            Category.find({ _id: { $in: cat_ids } }, function(err, cats) {
                                                if (err) {
                                                    res.json({ 'success': false });
                                                } else {
                                                    Question.find({}, function(err, ques) {
                                                        if (err) {
                                                            res.json({ 'success': false });
                                                        } else {
                                                            var rest_info = [];
                                                            for (var i = 0; i < rests.length; i++) {
                                                                rest_info.push({ name: rests[i].name, pic: rests[i].pictures[0], rating: rests[i].rating });
                                                            }
                                                            var answers = [];
                                                            if (user_que) {
                                                                for (var i = 0; i < user_que.answers.length; i++) {
                                                                    var temp = {
                                                                        question: '',
                                                                        answers: []
                                                                    }
                                                                    for (var j = 0; j < ques.length; j++) {
                                                                        if (user_que.answers[i].que_id == ques[j]._id) {
                                                                            temp.question = ques[j].question;
                                                                            break;
                                                                        }
                                                                    }
                                                                    for (var j = 0; j < user_que.answers[i].ans_num.length; j++) {
                                                                        for (var z = 0; z < cats.length; z++) {
                                                                            if (cats[z]._id == user_que.answers[i].ans_num[j]) {
                                                                                temp.answers.push(cats[z].name);
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                    answers.push(temp);
                                                                }
                                                            }
                                                            res.json({ 'success': true, 'user': user, 'rest_info': rest_info, 'answers': answers });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        },
        remove_user: function(req, res) {
            var id = req.query.id;
            UserQue.remove({ user_id: id }, function(err) {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    UserRest.remove({ user_id: id }, function(err) {
                        if (err) {
                            res.json({ 'success': false });
                        } else {
                            fs.unlink('./upload/profile/' + id + '.png', function(err) {
                                if (err) {
                                    res.json({ "success": false });
                                } else {
                                    User.remove({ _id: id }, function(err) {
                                        if (err) {
                                            res.json({ 'success': false });
                                        } else {
                                            getUser(res);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        },

        get_home: function(req, res) {
            getHome(res);
        },
        add_home: function(req, res) {
            var now = 'home' + moment();
            var path = 'upload/home/' + now + '.png';
            fs.writeFile(path, req.body.file, 'base64', function(err) {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    var newHome = new Home({
                        photo: now
                    });
                    dataPro.saveThing(res, newHome, function() {
                        getHome(res);
                    });
                }
            });
        },
        remove_home: function(req, res) {
            Home.findOne({ _id: req.query.id }, function(err, home) {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    fs.unlink('./upload/home/' + home.photo + '.png', function(err) {
                        if (err) {
                            res.json({ "success": false });
                        } else {
                            Home.remove({ _id: req.query.id }, function(err) {
                                if (err) {
                                    res.json({ 'success': false });
                                } else {
                                    getHome(res);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
}