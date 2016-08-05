'use strict';

angular
  .module('core')
  .service('LimitSrv', ['$rootScope',
    function($rootScope) {
      return {
        get: function() {
          var limit = 12;
          $rootScope.IS_PORTRAIT = ionic.Platform.portrait();
          $rootScope.IS_TABLET = ionic.Platform.tablet();

          if (!$rootScope.IS_TABLET) {
            limit = $rootScope.IS_PORTRAIT ? 6 : 8;
          } else if ($rootScope.IS_TABLET) {
            limit = $rootScope.IS_PORTRAIT ? 6 : 8;
          }

          return limit;
        }
      };
    }
  ]);
