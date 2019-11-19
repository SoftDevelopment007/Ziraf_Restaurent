/**
 * @author v.lugovsky
 * created on 17.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .filter('myCaPhoto', myCaPhoto);

  /** @ngInject */
  function myCaPhoto(config) {
    return function(input) {
      return config.baseUrl + '/upload/category?url=' + input + '.png&ts=' + new Date().getTime();
    };
  }

})();