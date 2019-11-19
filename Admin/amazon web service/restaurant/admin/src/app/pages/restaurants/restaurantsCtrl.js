(function () {
    'use strict';
    
    angular.module('BlurAdmin.pages.restaurants')
        .controller('RestaurantsCtrl', RestaurantsCtrl);

    /** @ngInject */
    function RestaurantsCtrl($scope, $http, toastr, config, fileReader, editableOptions, $uibModal) {
        $scope.table = 'wait';
       
        $scope.price_value = [1, 2, 3, 4, 5];
        $scope.info = {
            rests: [],
            cats: [],
            cat_titles: [],
            new_rest: {
                name: '',
                street_name: '',
                location: [0.0, 0.0],
                phone_number: '',
                opening_hours: [],
                price: 1
            },
            photo: '',
            opening_hour: '',
            rest: [],
            reviews: [],
            multipleItem: []
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

        var getRest = function () {
            $scope.table = 'wait';
            $http.get(config.baseUrl + '/category/get_all_rests')
                .success(function (data) {
                    if (data.success) {
                        toastr.info('Get all restaurants.', 'Success!', config.toastOption);
                        proRests(data);
                    } else {
                        toastr.error("Please try again.", 'Error!', config.toastOption);
                    }
                })
                .error(function (response) {
                    toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                });
        };
        var proRests = function (data) {
            $scope.info.cats = [];
            $scope.info.rests = data.info;
            $scope.info.cat_titles = [];
            var cat_info = data.cats;
            var temp = [];
            var temp1 = [];
            for (var i = 0; i < cat_info.length; i++) {
                if (cat_info[i].type == 'm') {
                    temp.push(cat_info[i]);
                }
                if (cat_info[i].type == 'h') {
                    temp1.push(cat_info[i]);
                }
            }
            $scope.info.cats.push(temp);
            $scope.info.cat_titles.push("Main categories");
            for (var i = 0; i < temp1.length; i++) {
                $scope.info.cats[i + 1] = [];
                $scope.info.cat_titles.push(temp1[i].name + '(Header categories)');
                for (var j = 0; j < cat_info.length; j++) {
                    if (cat_info[j].parent_id == temp1[i]._id) {
                        $scope.info.cats[i + 1].push(cat_info[j]);
                    }
                }
            }

            $scope.table = 'ok';
        };
        getRest();

        $scope.add = function () {
            $scope.info.new_rest = {
                name: '',
                street_name: '',
                location: [0.0, 0.0],
                phone_number: '',
                opening_hours: [],
                price: 1
            }
            for (var i = 0; i < $scope.info.cats.length; i++) {
                $scope.info.multipleItem[i] = [];
            }
            $scope.info.photo = '';
            $scope.info.opening_hour = '';
            $scope.table = 'ok_add';
            setTimeout(function () {
                var mapCanvas = document.getElementById('google-maps1');
                var myCenter = new google.maps.LatLng($scope.info.new_rest.location[0], $scope.info.new_rest.location[1]);
                var mapOptions = { center: myCenter, zoom: 3 };
                var map = new google.maps.Map(mapCanvas, mapOptions);
                var sub_position = new google.maps.LatLng($scope.info.new_rest.location[0], $scope.info.new_rest.location[1]);
                var sub_marker = new google.maps.Marker({
                    position: sub_position,
                    map: map
                });
                map.addListener('click', function (e) {
                    sub_marker.setMap(null);
                    sub_marker = new google.maps.Marker({
                        position: e.latLng,
                        map: map
                    });
                    map.panTo(e.latLng);
                    $scope.info.new_rest.location = [e.latLng.lat(), e.latLng.lng()];
                });
            }, 2000);
        };
        $scope.back = function () {
            getRest();
        };
        $scope.add_sub = function () {
            if ($scope.info.opening_hour == '') {
                toastr.warning("Please type content.", 'Warning!', config.toastOption);
            } else {
                $scope.info.new_rest.opening_hours.push($scope.info.opening_hour);
                $scope.info.opening_hour = '';
            }
        };
        $scope.remove_sub = function (id) {
            $scope.info.new_rest.opening_hours.splice(id, 1);
        };
        $scope.add_rest = function () {
            var z_info = $scope.info.new_rest;
            if ($scope.info.photo == '') {
                toastr.warning("Please select restaurant picture.", 'Warning!', config.toastOption);
            } else {
                if (z_info.name == '' || z_info.phone_number == '' || z_info.price == '' || z_info.opening_hours.length == 0 || z_info.street_name == '') {
                    toastr.warning("Please select restaurant info.", 'Warning!', config.toastOption);
                } else {
                    $scope.table = 'change';
                    var imageStr = $scope.info.photo.split(",")[1];
                    var temp = {
                        file: imageStr,
                        name: z_info.name,
                        street_name: z_info.street_name,
                        phone_number: z_info.phone_number,
                        price: z_info.price,
                        opening_hours: z_info.opening_hours,
                        category_id: [],
                        location: z_info.location,
                    }
                    for (var i = 0; i < $scope.info.multipleItem.length; i++) {
                        for (var j = 0; j < $scope.info.multipleItem[i].length; j++) {
                            temp.category_id.push($scope.info.multipleItem[i][j]._id);
                        }
                    }
                    $http.post(config.baseUrl + '/category/add_rest', temp)
                        .success(function (data) {
                            if (data.success) {
                                toastr.info('Add new restaurant.', 'Success!', config.toastOption);
                                proRests(data);
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
        $scope.view = function (id) {
            $scope.table = 'wait';
            $http.get(config.baseUrl + '/category/get_rest_info?user_id=0&rest_id=' + id)
                .success(function (data) {
                    if (data.success) {
                        toastr.info('Get the restaurant info.', 'Success!', config.toastOption);
                        $scope.info.rest = data.info;
                        $scope.info.rest.rating = (Math.round($scope.info.rest.rating * 2) / 2).toFixed(1);
                        $scope.info.reviews = data.reviews;
                        $scope.info.top_picks = data.top_picks;
                        for (var i = 0; i < $scope.info.reviews.length; i++) {
                            for (var j = 0; j < data.zirafers.length; j++) {
                                if ($scope.info.reviews[i].zirafer_id == data.zirafers[j].id) {
                                    $scope.info.reviews[i].zirafer = data.zirafers[j];
                                    break;
                                }
                            }
                        }
                        for (var i = 0; i < $scope.info.top_picks.length; i++) {
                            for (var j = 0; j < data.zirafers.length; j++) {
                                if ($scope.info.top_picks[i].zirafer_id == data.zirafers[j].id) {
                                    $scope.info.top_picks[i].zirafer = data.zirafers[j];
                                    break;
                                }
                            }
                        }
                        $scope.table = 'ok_detail';
                        $scope.info.btn1 = 'Add Photo';
                        $scope.info.btn3 = 'Add Menu File';
                        $scope.myFile = '';
                        for (var i = 0; i < $scope.info.cats.length; i++) {
                            $scope.info.multipleItem[i] = [];
                            for (var j = 0; j < $scope.info.cats[i].length; j++) {
                                for (var z = 0; z < $scope.info.rest.category_id.length; z++) {
                                    if ($scope.info.cats[i][j]._id == $scope.info.rest.category_id[z]) {
                                        $scope.info.multipleItem[i].push($scope.info.cats[i][j]);
                                        break;
                                    }
                                }
                            }
                        }
                        setTimeout(function () {
                            var mapCanvas = document.getElementById('google-maps2');
                            var myCenter = new google.maps.LatLng($scope.info.rest.location[0], $scope.info.rest.location[1]);
                            var mapOptions = { center: myCenter, zoom: 4 };
                            var map = new google.maps.Map(mapCanvas, mapOptions);
                            var sub_position = new google.maps.LatLng($scope.info.rest.location[0], $scope.info.rest.location[1]);
                            var sub_marker = new google.maps.Marker({
                                position: sub_position,
                                map: map
                            });
                            $('.inputfile').each(function () {
                                var $input = $(this),
                                    $label = $input.next('label'),
                                    labelVal = $label.html();

                                $input.on('change', function (e) {
                                    $scope.myFile = e.target.files[0];
                                    var fileName = '';
                                    if (this.files && this.files.length > 1)
                                        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                                    else if (e.target.value)
                                        fileName = e.target.value.split('\\').pop();
                                    if (fileName)
                                        $label.find('span').html(fileName);
                                    else
                                        $label.html(labelVal);
                                });
                                // Firefox bug fix
                                $input
                                    .on('focus', function () { $input.addClass('has-focus'); })
                                    .on('blur', function () { $input.removeClass('has-focus'); });
                            });
                            PDFObject.embed(config.baseUrl + "/upload/menu?url=" + $scope.info.rest._id + '.pdf', "#pdf_view");
                        }, 2000);
                    } else {
                        toastr.error("Please try again.", 'Error!', config.toastOption);
                    }
                })
                .error(function (response) {
                    toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                });
        };
        $scope.add_sub1 = function () {
            if ($scope.info.opening_hour1 == '') {
                toastr.warning("Please type content.", 'Warning!', config.toastOption);
            } else {
                $scope.info.rest.opening_hours.push($scope.info.opening_hour1);
                $scope.info.opening_hour1 = '';
            }
        };
        $scope.remove_sub1 = function (id) {
            $scope.info.rest.opening_hours.splice(id, 1);
        };
        $scope.change_rest = function () {
            var z_info = $scope.info.rest;
            if (z_info.name == '' || z_info.phone_number == '' || z_info.price == '' || z_info.opening_hours.length == 0 || z_info.street_name == '') {
                toastr.warning("Please select restaurant info.", 'Warning!', config.toastOption);
            } else {
                var temp = {
                    id: z_info._id,
                    name: z_info.name,
                    street_name: z_info.street_name,
                    phone_number: z_info.phone_number,
                    price: z_info.price,
                    opening_hours: z_info.opening_hours,
                    category_id: []
                }
                for (var i = 0; i < $scope.info.multipleItem.length; i++) {
                    for (var j = 0; j < $scope.info.multipleItem[i].length; j++) {
                        temp.category_id.push($scope.info.multipleItem[i][j]._id);
                    }
                }
                $http.post(config.baseUrl + '/category/change_rest_info', temp)
                    .success(function (data) {
                        if (data.success) {
                            toastr.info('Change restaurant info.', 'Success!', config.toastOption);
                            $scope.info.rest = data.info;
                        } else {
                            toastr.error("Please try again.", 'Error!', config.toastOption);
                        }
                    })
                    .error(function (response) {
                        toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                    });
            }
        };
        $scope.init_photo = function () {
            $scope.info.photo = "";
        };
        $scope.add_photo = function () {
            if ($scope.info.photo == '') {
                toastr.warning("Please select restaurant picture.", 'Warning!', config.toastOption);
            } else { 
                $scope.info.btn1 = 'Uploading...';
                var imageStr = $scope.info.photo.split(",")[1];
                var temp = {
                    file: imageStr,
                    id: $scope.info.rest._id
                }
                $http.post(config.baseUrl + '/category/add_photo', temp)
                    .success(function (data) {
                        if (data.success) {
                            toastr.info('Add new restaurant picture.', 'Success!', config.toastOption);
                            $scope.info.rest = data.info;
                            $scope.info.photo = '';
                            $scope.info.btn1 = 'Add Photo';
                        } else {
                            toastr.error("Please try again.", 'Error!', config.toastOption);
                        }
                    })
                    .error(function (response) {
                        toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                    });
            }
        };
        $scope.add_menu = function () {
            if ($scope.myFile == '') {
                toastr.warning("Please select menu file.", 'Warning!', config.toastOption);
            } else {
                $scope.info.btn3 = 'Uploading...';
                var fd = new FormData();
                fd.append('menu', $scope.myFile);
                $http.post(config.baseUrl + '/category/add_menu?id=' + $scope.info.rest._id, fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                    .success(function (data) {
                        if (data.success) {
                            toastr.info('Add new restaurant menu.', 'Success!', config.toastOption);
                            $scope.myFile = '';
                            $scope.info.btn3 = 'Add Menu File';
                            PDFObject.embed(config.baseUrl + "/upload/menu?url=" + $scope.info.rest._id + '.pdf', "#pdf_view");
                        } else {
                            toastr.error("Please try again.", 'Error!', config.toastOption);
                        }
                    })
                    .error(function (response) {
                        toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                    });
            }
        };
        $scope.remove = function (id) {
            $http.get(config.baseUrl + '/category/remove_rest?id=' + id)
                .success(function (data) {
                    if (data.success) {
                        toastr.info('Remove the restaurant.', 'Success!', config.toastOption);
                        proRests(data);
                    } else {
                        toastr.error("Please try again.", 'Error!', config.toastOption);
                    }
                })
                .error(function (response) {
                    toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                });
        }

        $scope.showImg = function (url) {
            var modalIns = $uibModal.open({
                animation: true,
                templateUrl: "app/pages/restaurants/showImg.html",
                size: 'lg',
                scope: $scope
            });
            $scope.img_url = url;
        };
        $scope.showImg1 = function (url) {
            var modalIns = $uibModal.open({
                animation: true,
                templateUrl: "app/pages/restaurants/showImg1.html",
                size: 'lg',
                scope: $scope
            });
            $scope.img_url = url;
        };
        $scope.deleteItem = function (image_name) { 
            $http.delete(config.baseUrl + '/category/remove_rest_image?image_name=' + image_name)
            .success(function(data) {
                if(data.status) {
                    toastr.info('Remove the photo.', 'Success!', config.toastOption);
                    $scope.info.rest = data.info;
                    $scope.info.photo = '';
                } else {
                    toastr.error("Please try again.", 'Error!', config.toastOption);
                }
            })
            .error(function(response) {
                toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
            });
            
        };
       
        $scope.update_resto_photo = function () {
            
                var imageStr = $scope.info.rest.pictures;
                var temp = {
                    pictures: imageStr,
                    id: $scope.info.rest._id
                }
                
                $http.put(config.baseUrl + '/category/update_res_photo', temp)
                    .success(function (data) {
                        if (data.success) {
                            console.log('Add new restaurant picture possion changed Success!');
                        } else {
                            console.log("Please try again.", 'Error!', config.toastOption);
                        }
                    })
                    .error(function (response) {
                        toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                    });
            }
            $scope.sortableOptions = {
                update: $scope.update_resto_photo,
                axis: 'x'
            }
        editableOptions.theme = 'bs3';
    }
})();