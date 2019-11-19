(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('categories', {
          url: '/categories',
          templateUrl: 'app/pages/categories/categories.html',
          title: 'Categories',
          controller: 'CategoriesCtrl',
          sidebarMeta: {
            icon: 'fa fa-bars',
            order: 3,
          },
        });
  }
})();