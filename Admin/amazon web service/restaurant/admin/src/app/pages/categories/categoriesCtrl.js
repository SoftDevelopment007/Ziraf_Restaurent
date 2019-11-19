(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories')
      .controller('CategoriesCtrl', CategoriesCtrl);

  /** @ngInject */
  function CategoriesCtrl($scope, $http, toastr, config, editableOptions, fileReader,  $uibModal) {
    $scope.table = 'wait';
    $scope.info = {
        main_ca: [],
        header_ca: [],
        sub_ca: [],
        main_name: '',
        main_photo: '',
        header_name: '',
        header_index: 0,
        sub_name: '',
        parent_id: 0,
        ques: [],
        que: '',
        que_id: 0,
        que_index: 0,
        change: {
            id: 0,
            name: ''
        }
    };

    $scope.uploadPicture = function () {
        var fileInput = document.getElementById('uploadFile');
        fileInput.click();
    };
    $scope.getFile = function(file) {
        fileReader.readAsDataUrl(file, $scope)
        .then(function (result) {
            $scope.info.main_photo = result;
        });
    };

    var getCa = function() {
        $scope.table = 'wait';
        $http.get(config.baseUrl + '/category/get_cat')
        .success(function(data) {
            if(data.success) {
                toastr.info('Get all main categories.', 'Success!', config.toastOption);
                $scope.info.main_ca = data.mains;
                $scope.info.header_ca = data.headers;
                $scope.info.main_name = '';
                $scope.info.main_photo = '';
                $scope.table = 'ok';
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };
    getCa();

    var getMainCa = function() {
		$scope.table = 'wait';
		$http.get(config.baseUrl + '/category/get_main_cat')
		.success(function(data) {
			if(data.success) {
			  	toastr.info('Get all main categories.', 'Success!', config.toastOption);
                $scope.info.main_ca = data.info;
                $scope.info.main_name = '';
                $scope.info.main_photo = '';
			  	$scope.table = 'ok';
			} else {
			  	toastr.error("Please try again.", 'Error!', config.toastOption);
			}
		})
		.error(function(response) {
			toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
		});
    };
    $scope.add_main = function() {
        if($scope.info.main_name == '' || $scope.info.main_photo == '') {
            toastr.warning("Please input main category info.", 'Warning!', config.toastOption);
        } else {
            $scope.table = 'wait';
            var imageStr = $scope.info.main_photo.split(",")[1];
            var temp = {
                file: imageStr,
                name: $scope.info.main_name,
                type: 'm'
            }
            $http.post(config.baseUrl + '/category/add_cat', temp)
            .success(function(data) {
                if(data.success) {
                    toastr.info('Add new main category.', 'Success!', config.toastOption);
                    getMainCa();
                } else {
                    toastr.error("Please try again.", 'Error!', config.toastOption);
                }
            })
            .error(function(response) {
                toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
            });
        }
    };
    $scope.remove_main = function(id) {
        $scope.table = 'wait';
        $http.get(config.baseUrl + '/category/remove_cat?type=m&id=' + id)
        .success(function(data) {
            if(data.success) {
                toastr.info('Remove the main category.', 'Success!', config.toastOption);
                getMainCa();
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };

    $scope.showImg = function(url) {
        var modalIns = $uibModal.open({
            animation: true,
            templateUrl: "app/pages/categories/showImg.html",
            size: 'lg',
            scope: $scope
        });
        $scope.img_url = url;
    };

    var getHeaderCa = function() {
        $scope.table = 'wait';
        $http.get(config.baseUrl + '/category/get_header_cat')
        .success(function(data) {
            if(data.success) {
                toastr.info('Get all header categories.', 'Success!', config.toastOption);
                $scope.info.header_ca = data.info;
                $scope.info.header_name = '';
                $scope.table = 'ok';
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    }
    $scope.add_header = function() {
        if($scope.info.header_name == '') {
            toastr.warning("Please input header category info.", 'Warning!', config.toastOption);
        } else {
            $scope.table = 'wait';
            var temp = {
                name: $scope.info.header_name,
                type: 'h'
            }
            $http.post(config.baseUrl + '/category/add_cat', temp)
            .success(function(data) {
                if(data.success) {
                    toastr.info('Add new header category.', 'Success!', config.toastOption);
                    getHeaderCa();
                } else {
                    toastr.error("Please try again.", 'Error!', config.toastOption);
                }
            })
            .error(function(response) {
                toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
            });
        }
    };
    $scope.remove_header = function(id) {
        $scope.table = 'wait';
        $http.get(config.baseUrl + '/category/remove_cat?type=h&id=' + id)
        .success(function(data) {
            if(data.success) {
                toastr.info('Remove the header category.', 'Success!', config.toastOption);
                getHeaderCa();
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };

    var getSubCa = function(id) {
        $http.get(config.baseUrl + '/category/get_sub_cat?id=' + id)
        .success(function(data) {
            if(data.success) {
                toastr.info('Get all sub categories.', 'Success!', config.toastOption);
                $scope.info.sub_ca = data.info;
                $scope.info.sub_name = '';
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    }
    $scope.getSubCa = function() {
        $scope.info.header_index = 0;
        $scope.info.parent_id = $scope.info.header_ca[0]._id;
        getSubCa($scope.info.parent_id);
    };
    $scope.sel_header = function(id) {
        $scope.info.parent_id = id;
        for(var i = 0; i < $scope.info.header_ca.length; i++) {
            if(id == $scope.info.header_ca[i]._id) {
                $scope.info.header_index = i;
                break;
            }
        }
        getSubCa(id);
    };
    $scope.add_sub = function() {
        if($scope.info.sub_name == '') {
            toastr.warning("Please input sub category info.", 'Warning!', config.toastOption);
        } else {
            var temp = {
                name: $scope.info.sub_name,
                type: 's',
                parent_id: $scope.info.parent_id
            }
            $http.post(config.baseUrl + '/category/add_cat', temp)
            .success(function(data) {
                if(data.success) {
                    toastr.info('Add new sub category.', 'Success!', config.toastOption);
                    getSubCa($scope.info.parent_id);
                } else {
                    toastr.error("Please try again.", 'Error!', config.toastOption);
                }
            })
            .error(function(response) {
                toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
            });
        }
    };
    $scope.remove_sub = function(id) {
        $http.get(config.baseUrl + '/category/remove_cat?type=s&id=' + id)
        .success(function(data) {
            if(data.success) {
                toastr.info('Remove the sub category.', 'Success!', config.toastOption);
                getSubCa($scope.info.parent_id);
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };

    var getQue = function() {
        $http.get(config.baseUrl + '/question/get_questions')
        .success(function(data) {
            if(data.success) {
                toastr.info('Get all questions.', 'Success!', config.toastOption);
                $scope.info.ques = data.info;
                $scope.info.que = '';
                $scope.info.que_id = $scope.info.header_ca[0]._id;
                $scope.info.que_index = 0;
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };
    $scope.sel_que = function(id) {
        $scope.info.que_id = id;
        for(var i = 0; i < $scope.info.header_ca.length; i++) {
            if(id == $scope.info.header_ca[i]._id) {
                $scope.info.que_index = i;
                break;
            }
        }
    };
    $scope.getQue = function() {
        if($scope.info.ques.length == 0) {
            getQue();
        }
    };
    $scope.add_que = function() {
        if($scope.info.que == '') {
            toastr.warning("Please input question info.", 'Warning!', config.toastOption);
        } else {
            var temp = {
                question: $scope.info.que,
                answer_id: $scope.info.que_id
            }
            $http.post(config.baseUrl + '/question/add_question', temp)
            .success(function(data) {
                if(data.success) {
                    toastr.info('Add new question.', 'Success!', config.toastOption);
                    $scope.info.ques = data.info;
                    $scope.info.que = '';
                    $scope.info.que_id = $scope.info.header_ca[0]._id;
                    $scope.info.que_index = 0;
                } else {
                    toastr.error("Please try again.", 'Error!', config.toastOption);
                }
            })
            .error(function(response) {
                toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
            });
        }
    };
    $scope.change_que = function(id, question) {
        var temp = {
            id: id,
            question: question
        };
        $http.post(config.baseUrl + '/question/change_question', temp)
        .success(function(data) {
            if(data.success) {
                toastr.info('Change the question.', 'Success!', config.toastOption);
                $scope.info.ques = data.info;
                $scope.info.que = '';
                $scope.info.que_id = $scope.info.header_ca[0]._id;
                $scope.info.que_index = 0;
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };

    var modalIns;
    $scope.change_main_cat = function(id, name) {
        modalIns = $uibModal.open({
            animation: true,
            templateUrl: "app/pages/categories/change.html",
            size: 'lg',
            scope: $scope
        });
        $scope.info.main_photo = '';
        $scope.info.change = {
            id: id,
            name: name
        }
    };
    $scope.change_main = function() {
        if($scope.info.change.name == '') {
            toastr.warning("Please input main category info.", 'Warning!', config.toastOption);
        } else {
            modalIns.close();
            var temp = {
                file: '',
                name: $scope.info.change.name,
                id: $scope.info.change.id
            }
            if($scope.info.main_photo != '') {
                temp.file = $scope.info.main_photo.split(",")[1];
            }
            $http.post(config.baseUrl + '/category/change_cat', temp)
            .success(function(data) {
                if(data.success) {
                    toastr.info('Change main category.', 'Success!', config.toastOption);
                    config.dummy = Math.floor((Math.random() * 9000 + 999));
                    getMainCa();
                } else {
                    toastr.error("Please try again.", 'Error!', config.toastOption);
                }
            })
            .error(function(response) {
                toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
            });
        }
    };
    $scope.change_header = function(id, name) {
        var temp = {
            name: name,
            id: id
        }
        $http.post(config.baseUrl + '/category/change_cat', temp)
        .success(function(data) {
            if(data.success) {
                toastr.info('Change the category name.', 'Success!', config.toastOption);
                getHeaderCa();
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };
    $scope.change_sub = function(id, name) {
        var temp = {
            name: name,
            id: id
        }
        $http.post(config.baseUrl + '/category/change_cat', temp)
        .success(function(data) {
            if(data.success) {
                toastr.info('Change the category name.', 'Success!', config.toastOption);
                getSubCa($scope.info.parent_id);
            } else {
                toastr.error("Please try again.", 'Error!', config.toastOption);
            }
        })
        .error(function(response) {
            toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
        });
    };

    editableOptions.theme = 'bs3';
  }
})();