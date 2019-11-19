var fs = require('fs');
var multer = require('multer');

module.exports = function (models) {
    var Category = models.category;
    var Question = models.question;
    var Restaurant = models.restaurant;
    var TopPick = models.top_pick;
    var Review = models.review;
    var Zirafer = models.zirafer;
    var UserQue = models.user_que;
    var UserRest = models.user_rest;
    var dataPro = require('./dataPro.js')();
    var getAllRests = function (res) {
        Category.find({}, function (err, cats) {
            if (err) {
                res.json({ 'success': false });
            } else {
                Restaurant.find({}, function (err, rests) {
                    if (err) {
                        res.json({ 'success': false });
                    } else {
                        res.json({ 'success': true, 'info': rests, 'cats': cats });
                    }
                });
            }
        });
    };

    return {
        get_cat: function (req, res) {
            Category.find({ 'type': 'm' }, function (err, mains) {
                if (err) {
                    res.json({ 'success': false });
                } else {
                    Category.find({ 'type': 'h' }, function (err, headers) {
                        if (err) {
                            res.json({ 'success': false });
                        } else {
                            res.json({ 'success': true, 'mains': mains, 'headers': headers });
                        }
                    });
                }
            });
        },
        get_main_cat: function (req, res) {
            Category.find({ 'type': 'm' }, function (err, cats) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    res.json({ 'success': true, 'info': cats });
                }
            });
        },
        get_header_cat: function (req, res) {
            Category.find({ 'type': 'h' }, function (err, cats) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    res.json({ 'success': true, 'info': cats });
                }
            });
        },
        get_sub_cat: function (req, res) {
            Category.find({ 'parent_id': req.query.id }, function (err, cats) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    res.json({ 'success': true, 'info': cats });
                }
            });
        },
        add_cat: function (req, res) {
            var body = req.body;
            var newCat = new Category({
                name: body.name,
                type: body.type,
                parent_id: -1
            });
            if (body.type == 's') {
                newCat.parent_id = body.parent_id;
            }
            dataPro.saveThing(res, newCat, function (saved) {
                if (saved.type != 'm') {
                    res.json({ 'success': true });
                } else {
                    var path = 'upload/category/' + saved._id + '.png';
                    fs.writeFile(path, body.file, 'base64', function (err) {
                        if (err) {
                            res.json({ 'success': false });
                        } else {
                            res.json({ 'success': true });
                        }
                    });
                }
            });
        },
        remove_cat: function (req, res) {
            if (req.query.type == 'm') {
                fs.unlink('./upload/category/' + req.query.id + '.png', function (err) {
                    if (err) {
                        res.json({ 'success': false });
                    } else {
                        Category.remove({ '_id': req.query.id }, function (err) {
                            if (err) {
                                res.json({ 'success': false });
                            } else {
                                res.json({ 'success': true });
                            }
                        });
                    }
                });
            } else if (req.query.type == 'h') {
                Category.remove({ '_id': req.query.id }, function (err) {
                    if (err) {
                        res.json({ 'success': false });
                    } else {
                        Category.remove({ 'parent_id': req.query.id }, function (err) {
                            if (err) {
                                res.json({ 'success': false });
                            } else {
                                Question.remove({ 'answer_id': req.query.id }, function (err) {
                                    if (err) {
                                        res.json({ 'success': false });
                                    } else {
                                        res.json({ 'success': true });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                Category.remove({ '_id': req.query.id }, function (err) {
                    if (err) {
                        res.json({ 'success': false });
                    } else {
                        res.json({ 'success': true });
                    }
                });
            }
        },
        change_cat: function (req, res) {
            Category.findOne({ '_id': req.body.id }, function (err, cat) {
                if (cat) {
                    cat.name = req.body.name;
                    dataPro.saveThing(res, cat, function (saved) {
                        if (saved.type == 'm' && req.body.file != '') {
                            var path = 'upload/category/' + saved._id + '.png';
                            fs.writeFile(path, req.body.file, 'base64', function (err) {
                                if (err) {
                                    res.json({ 'success': false });
                                } else {
                                    res.json({ 'success': true });
                                }
                            });
                        } else {
                            res.json({ 'success': true });
                        }
                    });
                } else {
                    res.json({ 'success': false });
                }
            });
        },
        get_rests: function (req, res) {
            Restaurant.find({}, function (err, rests) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    if (rests.length == 0) {
                        res.json({ 'success': true, 'info': [] });
                    } else {
                        var temp = [];
                        for (var i = 0; i < rests.length; i++) {
                            for (var j = 0; j < rests[i].category_id.length; j++) {
                                if (rests[i].category_id[j] == req.query.id) {
                                    temp.push(rests[i]);
                                    break;
                                }
                            }
                        }
                        var info = [];
                        for (var i = 0; i < temp.length; i++) {
                            info.push({ id: temp[i]._id, name: temp[i].name, street_name: temp[i].street_name, rating: temp[i].rating, picture: temp[i].pictures[0], price: temp[i].price });
                        }
                        res.json({ 'success': true, 'info': info });
                    }
                }
            });
        },
        get_near_rests: function (req, res) {
            UserQue.findOne({ user_id: req.query.id }, function (err, user_que) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    var cat_ids = [];
                    if (user_que) {
                        for (var i = 0; i < user_que.answers.length; i++) {
                            for (var j = 0; j < user_que.answers[i].ans_num.length; j++) {
                                cat_ids.push(user_que.answers[i].ans_num[j]);
                            }
                        }
                    }
                    Restaurant.find({}, function (err, rests) {
                        if (err) {
                            res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                        } else {
                            if (rests.length == 0) {
                                res.json({ 'success': true, 'info': [] });
                            } else {
                                var temp = [];
                                for (var i = 0; i < rests.length; i++) {
                                    for (var j = 0; j < rests[i].category_id.length; j++) {
                                        var isAdd = false;
                                        for (var z = 0; z < cat_ids.length; z++) {
                                            if (rests[i].category_id[j] == cat_ids[z]) {
                                                temp.push(rests[i]);
                                                isAdd = true;
                                                break;
                                            }
                                        }
                                        if (isAdd) {
                                            break;
                                        }
                                    }
                                }
                                var info = [];
                                for (var i = 0; i < temp.length; i++) {
                                    info.push({ id: temp[i]._id, name: temp[i].name, location: temp[i].location, picture: temp[i].pictures[0] });
                                }
                                res.json({ 'success': true, 'info': info });
                            }
                        }
                    });
                }
            });
        },
        get_all_rests: function (req, res) {
            getAllRests(res);
        },
        remove_rest: function (req, res) {
            Restaurant.findOne({ _id: req.query.id }, function (err, rest) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    var temp = 0;
                    for (var i = 0; i < rest.pictures.length; i++) {
                        fs.unlink('./upload/restaurant/' + rest.pictures[i] + '.png', function (err) {
                            if (err) {
                                res.json({ 'success': false });
                            } else {
                                temp++;
                                if (temp == rest.pictures.length) {
                                    fs.unlink('./upload/menu/' + req.query.id + '.pdf', function (err) {
                                        rest.remove(function (err) {
                                            if (err) {
                                                res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                            } else {
                                                Review.remove({ rest_id: req.query.id }, function (err) {
                                                    if (err) {
                                                        res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                                    } else {
                                                        UserRest.remove({ rest_id: req.query.id }, function (err) {
                                                            if (err) {
                                                                res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                                            } else {
                                                                TopPick.find({ 'rest_id': req.query.id }, function (err, top_picks) {
                                                                    if (err) {
                                                                        res.json({ 'success': false });
                                                                    } else {
                                                                        if (top_picks.length == 0) {
                                                                            getAllRests(res);
                                                                        } else {
                                                                            var temp = 0
                                                                            for (var i = 0; i < top_picks.length; i++) {
                                                                                fs.unlink('./upload/top_pick/' + top_picks[i]._id + '.png', function (err) {
                                                                                    if (err) {
                                                                                        res.json({ 'success': false });
                                                                                    } else {
                                                                                        temp++;
                                                                                        if (temp == top_picks.length) {
                                                                                            TopPick.remove({ 'rest_id': req.query.id }, function (err) {
                                                                                                if (err) {
                                                                                                    res.json({ 'success': false });
                                                                                                } else {
                                                                                                    getAllRests(res);
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
            })
        },
        add_rest: function (req, res) {
            var body = req.body;
            var newRest = new Restaurant({
                name: body.name,
                rating: -1,
                street_name: body.street_name,
                location: body.location,
                pictures: [],
                price: body.price,
                phone_number: body.phone_number,
                opening_hours: body.opening_hours,
                category_id: body.category_id
            });
            dataPro.saveThing(res, newRest, function (saved) {
                var path = 'pic' + saved._id + '_0';
                fs.writeFile('upload/restaurant/' + path + '.png', body.file, 'base64', function (err) {
                    if (err) {
                        res.json({ 'success': false });
                    } else {
                        saved.pictures.push(path);
                        dataPro.saveThing(res, saved, function (saved1) {
                            getAllRests(res);
                        });
                    }
                });
            });
        },
        add_photo: function (req, res) {
            var body = req.body;
            Restaurant.findOne({ '_id': body.id }, function (err, rest) {
                if (rest) {
                    var f_name = 'pic' + rest._id + '_' + rest.pictures.length;
                    var path = 'upload/restaurant/' + f_name + '.png';
                    fs.writeFile(path, body.file, 'base64', function (err) {
                        if (err) {
                            res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                        } else {
                            rest.pictures.push(f_name);
                            dataPro.saveThing(res, rest, function (saved) {
                                res.json({ 'success': true, 'info': saved });
                            });
                        }
                    });
                } else {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                }
            });
        },
        
        update_res_photo: function (req, res) {
            var body = req.body;
            Restaurant.findOne({ '_id': body.id }, function (err, rest) {
                if (rest) {
                    rest.pictures = req.body.pictures;
                    dataPro.saveThing(res, rest, function (saved) {
                        res.json({ 'success': true, 'info': saved });
                    });
               } else {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                }
            });
        },
        add_menu: function (req, res) {
            Restaurant.findOne({ '_id': req.query.id }, function (err, rest) {
                if (rest) {
                    var storage = multer.diskStorage({
                        destination: function (req, file, callback) {
                            callback(null, './upload/menu');
                        },
                        filename: function (req, file, callback) {
                            callback(null, rest._id + '.pdf');
                        }
                    });
                    var upload = multer({ storage: storage }).single('menu');
                    upload(req, res, function (err) {
                        if (err) {
                            res.json({ 'success': false });
                        } else {
                            res.json({ 'success': true });
                        }
                    });
                } else {
                    res.json({ 'success': false });
                }
            });
        },
        change_rest_info: function (req, res) {
            var body = req.body;
            Restaurant.findOne({ '_id': body.id }, function (err, rest) {
                if (rest) {
                    rest.name = body.name;
                    rest.street_name = body.street_name;
                    rest.phone_number = body.phone_number;
                    rest.price = body.price;
                    rest.opening_hours = body.opening_hours;
                    rest.category_id = body.category_id;
                    dataPro.saveThing(res, rest, function (saved) {
                        res.json({ 'success': true, 'info': saved });
                    });
                } else {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                }
            });
        },
        get_rest_info: function (req, res) {
            Restaurant.findOne({ _id: req.query.rest_id }, function (err, rest) {
                if (err) {
                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                    UserRest.findOne({ 'user_id': req.query.user_id, 'rest_id': req.query.rest_id }, function (err, user_rest) {
                        if (err) {
                            res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                        } else {
                            var favorite = false;
                            if (user_rest) {
                                favorite = true;
                            }
                            TopPick.find({ rest_id: req.query.rest_id }, function (err, top_picks) {
                                if (err) {
                                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                } else {
                                    Review.find({ rest_id: req.query.rest_id }, function (err, reviews) {
                                        if (err) {
                                            res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                        } else {
                                            Zirafer.find({}, function (err, zirafers) {
                                                if (err) {
                                                    res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                                                } else {
                                                    var zirafer_info = [];
                                                    for (var i = 0; i < zirafers.length; i++) {
                                                        zirafer_info.push({ id: zirafers[i]._id, name: zirafers[i].name });
                                                    }
                                                    res.json({ 'success': true, 'favorite': favorite, 'top_picks': top_picks, 'info': rest, 'reviews': reviews, 'zirafers': zirafer_info });
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
        remove_rest_image: function (req, res,next) {
            var image_name =req.query.image_name || req.body.image_name;
            var res_id = parseInt(image_name.split("_")[0].slice(3));
            console.log("image_name=", image_name, "res_id=", res_id);

            Restaurant.findOne({ '_id': res_id }, function (err, restaurant) {
                if (err) {
                    res.status(422).send({ status: false, message: 'Something went wrong' });
                } else {
                    console.log("restaturant= ", restaurant);
                    if (restaurant !== null) {
                        var indexs = restaurant.pictures.indexOf(image_name);
                        restaurant.pictures.splice(indexs, 1);
                        dataPro.saveThing(res, restaurant, function (saved) {
                            fs.unlink('./upload/restaurant/' + image_name + '.png', function (err) {
                                if (err) {
                                    next(err);
                                } else {
                                }
                            });
                            res.status(200).send({ status: true, message: 'Record is deleted successfully','info': saved });
                            
                        });
                    } else {
                        res.status(404).send({ status: false, message: 'No record found' });
                    }
                }
            });

        }
    }
}