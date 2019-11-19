
var fs = require('fs');
var moment = require('moment');

module.exports = function (models) {
  var Zirafer = models.zirafer;
  var Review = models.review;
  var Restaurant = models.restaurant;
  var TopPick = models.top_pick;
  var dataPro = require('./dataPro.js')();
  var getZirafer = function (res) {
    Zirafer.find({}, function (err, zirafers) {
      if (err) {
        res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
      } else {
        res.json({ 'success': true, 'info': zirafers });
        console.log(zirafers);
      }
    });
  };

  return {
    get_zirafers: function (req, res) {
      getZirafer(res);
    },
    get_zirafer: function (req, res) {
      Zirafer.findOne({ '_id': req.query.id }, function (err, zirafer) {
        if (err) {
          res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
        } else {
          Review.find({ 'zirafer_id': req.query.id }, function (err, reviews) {
            if (err) {
              res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
            } else {
              TopPick.find({ zirafer_id: req.query.id }, function (err, top_picks) {
                if (err) {
                  res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                } else {
                  Restaurant.find({}, function (err, rests) {
                    if (err) {
                      res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                    } else {

                      res.json({ 'success': true, 'info': zirafer, 'top_picks': top_picks, 'reviews': reviews, 'restaurants': rests });
                    }
                  });
                }
              });
            }
          });
        }
      });
    },
    add_zirafer: function (req, res) {
      var body = req.body;
      var newZirafer = new Zirafer({
        name: body.name,
        profession: body.profession,
        quote: body.quote,
        social_link: body.social_link,
        created_date: moment()
      });
      dataPro.saveThing(res, newZirafer, function (saved) {
        var path = 'upload/zirafer/' + saved._id + '.png';
        fs.writeFile(path, body.file, 'base64', function (err) {
          if (err) {
            res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
          } else {
            getZirafer(res);
          }
        });
      });
    },
    remove_zirafer: function (req, res) {
      Zirafer.findOne({ '_id': req.query.id }, function (err, zirafer) {
        if (zirafer) {
          fs.unlink('./upload/zirafer/' + zirafer._id + '.png', function (err) {
            if (err) {
              res.json({ 'success': false });
            } else {
              TopPick.find({ 'zirafer_id': req.query.id }, function (err, top_picks) {
                if (err) {
                  res.json({ 'success': false });
                } else {
                  if (top_picks.length == 0) {
                    zirafer.remove(function (err) {
                      if (err) {
                        res.json({ 'success': false });
                      } else {
                        Review.remove({ 'zirafer_id': req.query.id }, function (err) {
                          if (err) {
                            res.json({ 'success': false });
                          } else {
                            getZirafer(res);
                          }
                        });
                      }
                    });
                  } else {
                    var temp = 0
                    for (var i = 0; i < top_picks.length; i++) {
                      fs.unlink('./upload/top_pick/' + top_picks[i]._id + '.png', function (err) {
                        if (err) {
                          res.json({ 'success': false });
                        } else {
                          temp++;
                          if (temp == top_picks.length) {
                            zirafer.remove(function (err) {
                              if (err) {
                                res.json({ 'success': false });
                              } else {
                                TopPick.remove({ 'zirafer_id': req.query.id }, function (err) {
                                  if (err) {
                                    res.json({ 'success': false });
                                  } else {
                                    Review.remove({ 'zirafer_id': req.query.id }, function (err) {
                                      if (err) {
                                        res.json({ 'success': false });
                                      } else {
                                        getZirafer(res);
                                      }
                                    });
                                  }
                                });
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
        } else {
          res.json({ 'success': false });
        }
      });
    },
    change_zirafer_info: function (req, res) {
      var body = req.body;
      Zirafer.findOne({ '_id': body.id }, function (err, zirafer) {
        if (zirafer) {
          zirafer.social_link = body.social_link;
          zirafer.name = body.name;
          zirafer.profession = body.profession;
          zirafer.quote = body.quote;

          dataPro.saveThing(res, zirafer, function (saved) {
            var path = 'upload/zirafer/' + saved._id + '.png';
            console.log(path);
            fs.writeFile(path, body.file, 'base64', function (err) {
              if (err) {
                res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
              } else {
                res.json({ 'success': true, 'info': saved });
                console.log(saved);
              }
            });
          });
        } else {
          res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
        }
      });
    },
    submit_photo: function (req, res) {
      var body = req.body;
      var newTopPick = new TopPick({
        zirafer_id: body.id,
        rest_id: body.rest_id,
        description: body.description,
        created_date: moment()
      });
      dataPro.saveThing(res, newTopPick, function (saved) {
        var path = 'upload/top_pick/' + saved._id + '.png';
        fs.writeFile(path, body.file, 'base64', function (err) {
          if (err) {
            res.json({ 'success': false });
          } else {
            TopPick.find({ 'zirafer_id': body.id }, function (err, top_picks) {
              if (err) {
                res.json({ 'success': false });
              } else {
                res.json({ 'success': true, 'info': top_picks });
              }
            });
          }
        });
      });
    },
    submit_review: function (req, res) {
      var body = req.body;
      var newReview = new Review({
        zirafer_id: body.id,
        rest_id: body.rest_id,
        rating: body.rating,
        review: body.review,
        created_date: moment()
      });
      dataPro.saveThing(res, newReview, function () {
        Review.find({ 'rest_id': body.rest_id }, function (err, reviews1) {
          if (err) {
            res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
          } else {
            var temp = 0;
            for (var i = 0; i < reviews1.length; i++) {
              temp = temp + parseFloat(reviews1[i].rating[reviews1[i].rating.length - 1]);
            }
            Restaurant.findOne({ '_id': body.rest_id }, function (err, rest) {
              if (rest) {
                rest.rating = parseFloat((Math.round((temp / reviews1.length) * 2) / 2).toFixed(1));
                dataPro.saveThing(res, rest, function () {
                  Review.find({ 'zirafer_id': body.id }, function (err, reviews) {
                    if (err) {
                      res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
                    } else {
                      res.json({ 'success': true, 'info': reviews });
                    }
                  });
                });
              } else {
                res.json({ 'success': false, 'error': 'Connection error. Please try again.' });
              }
            });
          }
        });
      });
    },
    remove_top: function (req, res) {
      TopPick.findOne({ '_id': req.query.id }, function (err, top_pick) {
        if (top_pick) {
          fs.unlink('./upload/top_pick/' + top_pick._id + '.png', function (err) {
            if (err) {
              res.json({ 'success': false });
            } else {
              top_pick.remove(function (err) {
                if (err) {
                  res.json({ 'success': false });
                } else {
                  res.json({ 'success': true });
                }
              });
            }
          });
        } else {
          res.json({ 'success': false });
        }
      });
    },
    remove_review: function (req, res) {
      Review.findOne({ _id: req.query.id }, function (err, review) {
        if (err) {
          res.json({ 'success': false });
        } else {
          review.remove(function (err) {
            if (err) {
              res.json({ 'success': false });
            } else {
              Restaurant.findOne({ _id: review.rest_id }, function (err, rest) {
                if (err) {
                  res.json({ 'success': false });
                } else {
                  Review.find({ rest_id: review.rest_id }, function (err, reviews) {
                    if (err) {
                      res.json({ 'success': false });
                    } else {
                      if (reviews.length == 0) {
                        rest.rating = -1;
                      } else {
                        var temp = 0;
                        for (var i = 0; i < reviews.length; i++) {
                          temp = temp + parseFloat(reviews[i].rating[reviews[i].rating.length - 1]);
                        }
                        rest.rating = parseFloat((Math.round((temp / reviews.length) * 2) / 2).toFixed(1));
                      }
                      rest.save(function (err) {
                        if (err) {
                          res.json({ 'success': false });
                        } else {
                          res.json({ 'success': true });
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      });
    }
  }
}