
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.zirafers')
    .controller('ZirafersCtrl', ZirafersCtrl);

  /** @ngInject */
  function ZirafersCtrl($scope, $http, toastr, config, editableOptions, fileReader, $uibModal, $location) {
    $scope.table = 'wait';
    $scope.rating_param = ['Food quality', 'Service and interaction', 'Value for money', 'Ambience'];
    $scope.rating_value = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
    $scope.info = {
      zirafers: [],
      zirafer: {},
      reviews: [],
      top_picks: [],
      restaurants: [],
      new_zirafer: {
        name: '',
        profession: '',
        quote: '',
        social_link: ['', '', '', '']
      },
      photo: '',
      description: '',
      review: {
        rating: [10, 10, 10, 10],
        review: '',
        rest_id: 0
      }
    };
    

    $scope.uploadPicture = function () {
      var fileInput = document.getElementById('uploadFile');
      fileInput.click();
      
    };
    $scope.getFile = function (file) {
      fileReader.readAsDataUrl(file, $scope)
        .then(function (result) {
          $scope.info.photo = result;
        });
    };

    var getZirafers = function () {
      debugger;
      $scope.table = 'wait';
      $http.get(config.baseUrl + '/zirafer/get_zirafers')
        .success(function (data) {
          if (data.success) {
            toastr.info('Get all zirafers.', 'Success!', config.toastOption);
            $scope.info.zirafers = data.info;
            $scope.table = 'ok';
          } else {
            toastr.error("Please try again.", 'Error!', config.toastOption);
          }
        })
        .error(function (response) {
          toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };
    
    getZirafers();

    $scope.add = function () {
      $scope.info.new_zirafer = {
        name: '',
        profession: '',
        quote: '',
        social_link: ['', '', '', '']
      }
      $scope.info.photo = '';
      $scope.table = 'ok_add';
    };
    $scope.back = function () {        
        getZirafers();
    };
    $scope.remove = function (id) {
      $scope.table = 'change';
      $http.get(config.baseUrl + '/zirafer/remove_zirafer?id=' + id)
        .success(function (data) {
          if (data.success) {
            toastr.info('Remove the zirafer.', 'Success!', config.toastOption);
            $scope.info.zirafers = data.info;
            $scope.table = 'ok';
          } else {
            toastr.error("Please try again.", 'Error!', config.toastOption);
          }
        })
        .error(function (response) {
          toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };
    $scope.view = function (id) {
      $scope.table = 'change';
      $http.get(config.baseUrl + '/zirafer/get_zirafer?id=' + id)
        .success(function (data) {
          if (data.success) {
            toastr.info('Get zirafer info.', 'Success!', config.toastOption);
            $scope.info.zirafer = data.info;
            $scope.info.reviews = data.reviews;
            $scope.info.top_picks = data.top_picks;
            $scope.info.restaurants = data.restaurants;
            for (var i = 0; i < $scope.info.reviews.length; i++) {
              for (var j = 0; j < data.restaurants.length; j++) {
                if ($scope.info.reviews[i].rest_id == data.restaurants[j]._id) {
                  $scope.info.reviews[i].restaurant = data.restaurants[j];
                  break;
                }
              }
            }
            for (var i = 0; i < $scope.info.top_picks.length; i++) {
              for (var j = 0; j < data.restaurants.length; j++) {
                if ($scope.info.top_picks[i].rest_id == data.restaurants[j]._id) {
                  $scope.info.top_picks[i].restaurant = data.restaurants[j];
                  break;
                }           
              }
            }
            $scope.info.photo = '';
            $scope.info.description = '';
            $scope.info.review = {
              rating: [10, 10, 10, 10],
              review: '',
              rest_id: $scope.info.restaurants[0]._id
            }
            $scope.info.sel_rest = 0;
            $scope.btn_label = " Submit Photo";
            $scope.table = 'ok_detail';
          } else {
            toastr.error("Please try again.", 'Error!', config.toastOption);
          }
        })
        .error(function (response) {
          toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };
    $scope.sel_rest = function (index) {
      $scope.info.sel_rest = index;
      $scope.info.review.rest_id = $scope.info.restaurants[index]._id;
    }

    $scope.change_zirafer = function () {

      $scope.table = 'change';
      var z_info = $scope.info.zirafer;
      var imageStr = $scope.info.photo.split(",")[1];      
      // var temp = {
      //   id: z_info._id,
      //   name: z_info.name,
      //   profession: z_info.profession,
      //   quote: z_info.quote,
      //   social_link: z_info.social_link,
      //   file: imageStr
      // }
      var temp = {
        file: imageStr,
        name: z_info.name,
        profession: z_info.profession,
        quote: z_info.quote,
        social_link: z_info.social_link,
        id: $scope.info.zirafer._id
      }
       $http.post(config.baseUrl + '/zirafer/change_zirafer_info', temp)
        .success(function (data) {
          if (data.success) {
            debugger;
            toastr.info('Change zirafer info.', 'Success!', config.toastOption);
            $scope.info.zirafer = data.info;
            $scope.table = 'ok_detail';
          } else {
            toastr.error("Please try again.", 'Error!', config.toastOption);
          }
        })
        .error(function (response) {
          toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };

    $scope.submit_photo = function () {
      if ($scope.info.photo == '' || $scope.info.description == '') {
        toastr.warning("Please select photo or input description.", 'Warning!', config.toastOption);
      } else {
        $scope.btn_label = "Submitting...";
        var imageStr = $scope.info.photo.split(",")[1];
        var temp = {
          file: imageStr,
          id: $scope.info.zirafer._id,
          rest_id: $scope.info.review.rest_id,
          description: $scope.info.description
        }
        $http.post(config.baseUrl + '/zirafer/submit_photo', temp)
          .success(function (data) {
            if (data.success) {
              toastr.info('Submit the photo.', 'Success!', config.toastOption);
              $scope.info.top_picks = data.info;
              for (var i = 0; i < $scope.info.top_picks.length; i++) {
                for (var j = 0; j < $scope.info.restaurants.length; j++) {
                  if ($scope.info.top_picks[i].rest_id == $scope.info.restaurants[j]._id) {
                    $scope.info.top_picks[i].restaurant = $scope.info.restaurants[j];
                    break;
                  }
                }
              }
              $scope.info.photo = '';
              $scope.info.description = '';
              $scope.info.review = {
                rating: [10, 10, 10, 10],
                review: '',
                rest_id: $scope.info.restaurants[0]._id
              }
              $scope.info.sel_rest = 0;
              $scope.btn_label = " Submit Photo";
            } else {
              toastr.error("Please try again.", 'Error!', config.toastOption);
            }
          })
          .error(function (response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
          });
      }
    };

    $scope.showImg = function (url) {
      var modalIns = $uibModal.open({
        animation: true,
        templateUrl: "app/pages/zirafers/showImg.html",
        size: 'lg',
        scope: $scope
      });
      $scope.img_url = url;
    };

    $scope.add_zirafer = function () {
      var z_info = $scope.info.new_zirafer;
      if ($scope.info.photo == '') {
        toastr.warning("Please select zirafer image.", 'Warning!', config.toastOption);
      } else {
        if (z_info.name == '' || z_info.quote == '') {
          toastr.warning("Please select zirafer info.", 'Warning!', config.toastOption);
        } else {
          $scope.table = 'change';
          var imageStr = $scope.info.photo.split(",")[1];
          var temp = {
            file: imageStr,
            name: z_info.name,
            profession: z_info.profession,
            quote: z_info.quote,
            social_link: z_info.social_link,
            id: $scope.info.zirafer._id
          }
          $http.post(config.baseUrl + '/zirafer/add_zirafer', temp)
            .success(function (data) {
              if (data.success) {
                toastr.info('Add new zirafer.', 'Success!', config.toastOption);
                $scope.info.zirafers = data.info;
                $scope.table = 'ok';
              } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
              }
            })
            .error(function (response) {
              toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
            });
        }
      }
    };

    $scope.submit_review = function () {
      if ($scope.info.review.review == '') {
        toastr.warning("Please input review info.", 'Warning!', config.toastOption);
      } else {
        var temp = {
          rating: $scope.info.review.rating,
          review: $scope.info.review.review,
          rest_id: $scope.info.review.rest_id,
          id: $scope.info.zirafer._id
        }
        var rating_avg = parseFloat((Math.round((temp.rating[0] * 0.7 + temp.rating[1] * 0.1 + temp.rating[2] * 0.1 + temp.rating[3] * 0.1) * 2) / 2).toFixed(1));
        temp.rating.push(rating_avg);
        $http.post(config.baseUrl + '/zirafer/submit_review', temp)
          .success(function (data) {
            if (data.success) {
              toastr.info('Submit the review.', 'Success!', config.toastOption);
              $scope.info.reviews = data.info;
              for (var i = 0; i < $scope.info.reviews.length; i++) {
                for (var j = 0; j < $scope.info.restaurants.length; j++) {
                  if ($scope.info.reviews[i].rest_id == $scope.info.restaurants[j]._id) {
                    $scope.info.reviews[i].restaurant = $scope.info.restaurants[j];
                    break;
                  }
                }
              }
              $scope.info.photo = '';
              $scope.info.description = '';
              $scope.info.review = {
                rating: [10, 10, 10, 10],
                review: '',
                rest_id: $scope.info.restaurants[0]._id
              }
              $scope.info.sel_rest = 0;
            } else {
              toastr.error("Please try again.", 'Error!', config.toastOption);
            }
          })
          .error(function (response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
          });
      }
    }
    $scope.remove_top = function (id) {
      $http.get(config.baseUrl + '/zirafer/remove_top?id=' + id)
        .success(function (data) {
          if (data.success) {
            toastr.info('Remove the toppic.', 'Success!', config.toastOption);
            for (var i = 0; i < $scope.info.top_picks.length; i++) {
              if ($scope.info.top_picks[i]._id == id) {
                $scope.info.top_picks.splice(i, 1);
                break;
              }
            }
          } else {
            toastr.error("Please try again.", 'Error!', config.toastOption);
          }
        })
        .error(function (response) {
          toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    }
    $scope.remove_review = function (id) {
      $http.get(config.baseUrl + '/zirafer/remove_review?id=' + id)
        .success(function (data) {
          if (data.success) {
            toastr.info('Remove the review.', 'Success!', config.toastOption);
            for (var i = 0; i < $scope.info.reviews.length; i++) {
              if ($scope.info.reviews[i]._id == id) {
                $scope.info.reviews.splice(i, 1);
                break;
              }
            }
          } else {
            toastr.error("Please try again.", 'Error!', config.toastOption);
          }
        })
        .error(function (response) {
          toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    }

    editableOptions.theme = 'bs3';
  }
})();


