/**
 * @author v.lugovsky
 * created on 17.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .filter('myRestPhoto', myRestPhoto);

  /** @ngInject */
  function myRestPhoto(config) {
    return function(input) {
      return config.baseUrl + '/upload/restaurant?url=' + input + '.png';
    };
  }

})();