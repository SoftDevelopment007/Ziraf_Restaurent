(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .filter('myProfile', myProfile);

  /** @ngInject */
  function myProfile(config) {
    return function(input) {
      if(input == '') {
        input = 'avatar.png&temp=' + config.dummy;
      } else {
        input = input + '.png&temp=' + config.dummy;
      }
      return config.baseUrl + '/upload/profile?url=' + input;
    };
  }
})();