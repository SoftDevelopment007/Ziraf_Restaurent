(function () {
  'use strict';

  angular.module('BlurAdmin.pages.restaurants', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('restaurants', {
          url: '/restaurants',
          templateUrl: 'app/pages/restaurants/restaurants.html',
          title: 'Restaurants',
          controller: 'RestaurantsCtrl',
          sidebarMeta: {
            icon: 'fa fa-cutlery',
            order: 4,
          },
        });
  }
})();