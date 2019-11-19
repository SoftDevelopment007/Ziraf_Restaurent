module.exports = function (models) {
    var Question = models.question;
    var Category = models.category;
    var UserQue = models.user_que;
    var dataPro = require('./dataPro.js')();
    var getQuestion = function (res) {
        Question.find({}, function (err, ques) {
            if (err) {
                res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
            } else {
                Category.find({ type: 's' }, function (err, cats) {
                    if (err) {
                        res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                    } else {
                        var info = [];
                        for (var i = 0; i < ques.length; i++) {
                            var temp = {
                                question: { question: ques[i].question, id: ques[i]._id },
                                answers: []
                            }
                            for (var j = 0; j < cats.length; j++) {
                                if (cats[j].parent_id == ques[i].answer_id) {
                                    temp.answers.push({ id: cats[j]._id, name: cats[j].name });
                                }
                            }
                            info.push(temp);
                        }
                        res.json({ 'success': true, 'info': info });
                    }
                });
            }
        });
    };
    var getUserQue = function (res, id) {
        UserQue.findOne({ user_id: id }, function (err, user_que) {
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
                Category.find({ _id: { $in: cat_ids } }, function (err, cats) {
                    if (err) {
                        res.json({ 'success': false });
                    } else {
                        Question.find({}, function (err, ques) {
                            if (err) {
                                res.json({ 'success': false });
                            } else {
                                var answers = [];
                                if (user_que) {
                                    for (var i = 0; i < user_que.answers.length; i++) {
                                        var temp = {
                                            question: {},
                                            answers: []
                                        }
                                        for (var j = 0; j < ques.length; j++) {
                                            if (user_que.answers[i].que_id == ques[j]._id) {
                                                temp.question = { question: ques[j].question, id: ques[j]._id };
                                                break;
                                            }
                                        }
                                        for (var j = 0; j < user_que.answers[i].ans_num.length; j++) {
                                            for (var z = 0; z < cats.length; z++) {
                                                if (cats[z]._id == user_que.answers[i].ans_num[j]) {
                                                    temp.answers.push({ id: cats[z]._id, name: cats[z].name });
                                                    break;
                                                }
                                            }
                                        }
                                        answers.push(temp);
                                    }
                                }
                                res.json({ 'success': true, 'answers': answers });
                            }
                        });
                    }
                });
            }
        });
    };

    return {
        get_questions: function (req, res) {
            getQuestion(res);
        },
        add_question: function (req, res) {
            var body = req.body;
            var newQue = new Question({
                question: body.question,
                answer_id: body.answer_id
            });
            dataPro.saveThing(res, newQue, function () {
                getQuestion(res);
            });
        },
        change_question: function (req, res) {
            var body = req.body;
            Question.findOne({ '_id': body.id }, function (err, que) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    que.question = body.question;
                    dataPro.saveThing(res, que, function () {
                        getQuestion(res);
                    });
                }
            });
        },
        remove_question: function (req, res) {
            Question.remove({ '_id': req.query.id }, function (err) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    getQuestion(res);
                }
            });
        },

        change_user_answer: function (req, res) {
            var body = req.body;
            UserQue.findOne({ 'user_id': body.id }, function (err, user_que) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    if (user_que) {
                        user_que.answers = body.answers;
                        dataPro.saveThing(res, user_que, function () {
                            getUserQue(res, body.id);
                        });
                    } else {
                        var newUserQue = new UserQue({
                            user_id: body.id,
                            answers: body.answers
                        });
                        dataPro.saveThing(res, newUserQue, function () {
                            getUserQue(res, body.id);
                        });
                    }
                }
            });
        },
        get_user_answers: function (req, res) {
            getUserQue(res, req.query.id);
        },
        get_all_user_que: function (req, res) {
            UserQue.find({}, function (err, user_ques) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    res.json({ 'success': true, 'info': user_ques });
                }
            });
        },
        remove_user_que: function (req, res) {
            UserQue.remove({ _id: req.query.id }, function (err) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    UserQue.find({}, function (err, user_ques) {
                        if (err) {
                            res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                        } else {
                            res.json({ 'success': true, 'info': user_ques });
                        }
                    });
                }
            });
        }
    }
}