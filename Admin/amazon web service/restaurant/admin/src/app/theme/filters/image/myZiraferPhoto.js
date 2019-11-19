/**
 * @author v.lugovsky
 * created on 17.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .filter('myZiraferPhoto', myZiraferPhoto);

  /** @ngInject */
  function myZiraferPhoto(config) {
    return function(input) {
      return config.baseUrl + '/upload/zirafer?url=' + input + '.png&ts=' + new Date().getTime();
    };
  }

})();

