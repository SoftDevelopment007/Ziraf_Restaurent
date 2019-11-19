/**
 * @author v.lugovsky
 * created on 17.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .filter('myTopPhoto', myTopPhoto);

  /** @ngInject */
  function myTopPhoto(config) {
    return function(input) {
      return config.baseUrl + '/upload/top_pick?url=' + input + '.png';
    };
  }

})();