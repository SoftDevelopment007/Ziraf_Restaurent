(function () {
  'use strict';

  angular.module('BlurAdmin.pages.zirafers', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('zirafers', {
          url: '/zirafers',
          templateUrl: 'app/pages/zirafers/zirafers.html',
          title: 'Zirafers',
          controller: 'ZirafersCtrl',
          sidebarMeta: {
            icon: 'fa fa-star-half-o',
            order: 5,
          },
        });
  }

})();