/**
 * @author v.lugovsky
 * created on 17.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .filter('myHomePhoto', myHomePhoto);

  /** @ngInject */
  function myHomePhoto(config) {
    return function(input) {
      return config.baseUrl + '/upload/home?url=' + input + '.png';
    };
  }

})();