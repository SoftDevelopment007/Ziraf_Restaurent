(function () {
    'use strict';

    angular.module('BlurAdmin.pages.homes')
        .controller('HomesCtrl', HomesCtrl);

    /** @ngInject */
    function HomesCtrl($scope, $http, toastr, config, fileReader, editableOptions) {
        $scope.table = 'wait';
        $scope.info = {
            pics: [],
            photo: ''
        };

        $scope.uploadPicture = function () {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();
        };
        $scope.getFile = function (file) {
            if (file.size > 20000000) {
                toastr.warning("Image is too large.", 'Warning!', config.toastOption);
            } else {
                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        $scope.info.photo = result;
                    });
            }
        };

        var getHome = function () {
            $scope.table = 'wait';
            $http.get(config.baseUrl + '/admin/get_home')
                .success(function (data) {
                    if (data.success) {
                        proHome(data.info);
                    } else {
                        toastr.error("Please try again.", 'Error!', config.toastOption);
                    }
                })
                .error(function (response) {
                    toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                });
        };
        var proHome = function (info) {
            $scope.info.pics = info;
            $scope.myInterval = 4000;
            $scope.noWrapSlides = false;
            $scope.active = 0;
            var slides = $scope.slides = [];
            var currIndex = 0;
            for (var i = 0; i < $scope.info.pics.length; i++) {
                slides.push({
                    image: $scope.info.pics[i].photo,
                    id: currIndex++,
                    index: $scope.info.pics[i]._id
                });
            }

            $scope.info.photo = '';
            $scope.table = 'ok';
        };
        getHome();

        $scope.add = function () {
            if ($scope.info.photo == '') {
                toastr.warning("Please select image.", 'Warning!', config.toastOption);
            } else {
                $scope.table = 'change';
                var imageStr = $scope.info.photo.split(",")[1];
                var temp = {
                    file: imageStr
                }
                $http.post(config.baseUrl + '/admin/add_home', temp)
                    .success(function (data) {
                        if (data.success) {
                            toastr.info('Add home picture.', 'Success!', config.toastOption);
                            $scope.info.active = 0;
                            proHome(data.info);
                        } else {
                            toastr.error("Please try again.", 'Error!', config.toastOption);
                            getHome();
                        }
                    })
                    .error(function (response) {
                        toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                        getHome();
                    });
            }
        };

        $scope.remove = function (id) {
            $scope.table = 'change';
            $http.get(config.baseUrl + '/admin/remove_home?id=' + id)
                .success(function (data) {
                    if (data.success) {
                        toastr.info('Remove home picture.', 'Success!', config.toastOption);
                        proHome(data.info);
                    } else {
                        toastr.error("Please try again.", 'Error!', config.toastOption);
                        getHome();
                    }
                })
                .error(function (response) {
                    toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                    getHome();
                });
        }

        editableOptions.theme = 'bs3';
    }
})();