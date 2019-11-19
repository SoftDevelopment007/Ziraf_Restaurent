(function () {
  'use strict';

  angular.module('BlurAdmin.pages.homes', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('homes', {
          url: '/homes',
          templateUrl: 'app/pages/homes/homes.html',
          title: 'Homes',
          controller: 'HomesCtrl',
          sidebarMeta: {
            icon: 'fa fa-picture-o',
            order: 2,
          },
        });
  }
})();