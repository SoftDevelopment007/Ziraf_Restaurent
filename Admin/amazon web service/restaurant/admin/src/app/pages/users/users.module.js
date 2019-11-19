(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('users', {
          url: '/users',
          templateUrl: 'app/pages/users/users.html',
          title: 'Users',
          controller: 'UsersCtrl',
          sidebarMeta: {
            icon: 'ion-person-stalker',
            order: 1,
          },
        });
  }

})();