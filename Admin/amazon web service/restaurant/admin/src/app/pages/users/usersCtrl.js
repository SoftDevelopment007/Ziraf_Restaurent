(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('UsersCtrl', UsersCtrl);

    /** @ngInject */
    function UsersCtrl($scope, $http, toastr, config, editableOptions) {
        config.dummy = Math.floor((Math.random() * 9000 + 999));
        $scope.table = 'wait';
        $scope.user_detail = 'wait';
        $scope.isUserDetail = false;
        $scope.smartTableData = [];
        $scope.info = {};

        var getUsers = function () {
            $scope.table = 'wait';
            $http.get(config.baseUrl + '/admin/get_user')
                .success(function (data) {
                    if (data.success) {
                        toastr.info('Get all users.', 'Success!', config.toastOption);
                        $scope.smartTablePageSize = 10;
                        $scope.smartTableData = [];
                        proUsers(data.info);
                    } else {
                        toastr.error("Please try again.", 'Error!', config.toastOption);
                    }
                })
                .error(function (response) {
                    toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                });
        };
        var proUsers = function (info) {
            config.info.users = info;
            $scope.smartTableData = info;
            $scope.table = 'ok';
        };
        getUsers();

        $scope.remove = function (id) {
            $scope.table = 'change';
            $http.get(config.baseUrl + '/admin/remove_user?id=' + id)
                .success(function (data) {
                    if (data.success) {
                        toastr.success('Remove a user.', 'Success!', config.toastOption);
                    } else {
                        toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                    }
                    getUsers();
                })
                .error(function (response) {
                    toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                    getUsers();
                });
        };

        $scope.view = function (id) {
            $http.get(config.baseUrl + '/admin/get_user_info?id=' + id)
                .success(function (data) {
                    if (data.success) {
                        $scope.info = {
                            user: data.user,
                            rest_info: data.rest_info,
                            answers: data.answers
                        }
                        $scope.isUserDetail = true;
                        $scope.user_detail = 'ok_user';
                    } else {
                        toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                        getUsers();
                    }
                })
                .error(function (response) {
                    toastr.error("Connection error. Please try again.", 'Error!', config.toastOption);
                    getUsers();
                });
        };

        $scope.back = function () {
            $scope.isUserDetail = false;
            $scope.user_detail = 'wait';
            getUsers();
        };

        editableOptions.theme = 'bs3';
    }
})();