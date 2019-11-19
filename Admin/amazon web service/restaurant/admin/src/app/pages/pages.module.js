/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'ui.select',
    'ngSanitize',

    'BlurAdmin.pages.users',
    'BlurAdmin.pages.homes',
    'BlurAdmin.pages.categories',
    'BlurAdmin.pages.restaurants',
    'BlurAdmin.pages.zirafers',
  ])
  .config(routeConfig)
  .value('config', {
    baseUrl: "http://35.177.9.16:8080",
    // baseUrl: "localhost:8080",
    isValid: false,
    dummy: Math.floor((Math.random() * 9000 + 999)),
    toastOption: {
      "autoDismiss": false,
      "positionClass": "toast-top-right",
      "type": "info",
      "timeOut": "3000",
      "extendedTimeOut": "2000",
      "allowHtml": false,
      "closeButton": false,
      "tapToDismiss": true,
      "progressBar": false,
      "newestOnTop": true,
      "maxOpened": 0,
      "preventDuplicates": false,
      "preventOpenDuplicates": false
    },
    toastOption_short: {
      "autoDismiss": false,
      "positionClass": "toast-bottom-right",
      "type": "info",
      "timeOut": "500",
      "extendedTimeOut": "500",
      "allowHtml": false,
      "closeButton": false,
      "tapToDismiss": true,
      "progressBar": false,
      "newestOnTop": true,
      "maxOpened": 0,
      "preventDuplicates": false,
      "preventOpenDuplicates": false
    },
    info: {
      users: []
    }
  })
  .run(function($rootScope, $state, $http, config) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      if(!config.isValid) {
        if(localStorage.token) {
          $http.get(config.baseUrl + '/admin/isValid?token=' + localStorage.token)
          .success(function(data) {
            localStorage.removeItem("token");
            if(data.success) {
              config.isValid = true;
              window.open("/#/users", "_self", "", true);
            } else {
              window.open("auth.html", "_self", "", true);
            }
          })
          .error(function(response) {
            window.open("auth.html", "_self", "", true);
          });
        } else {
          event.preventDefault();
          window.open("auth.html", "_self", "", true);
        }
      }
    });
  });

  function routeConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise(function($injector, $location) {
      window.open("auth.html", "_self", "", true);
    });
  }
})();