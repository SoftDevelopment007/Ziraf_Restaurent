/**
 * @author v.lugovsky
 * created on 17.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
      .filter('noImage', noImage);

  /** @ngInject */
  function noImage() {
    return function() {
      return 'assets/img/no_image.jpg';
    };
  }

})();