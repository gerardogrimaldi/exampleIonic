'use strict';

angular
  .module('core')
  .service('LoadingSrv', ['$ionicLoading', '$timeout',
    function($ionicLoading, $timeout) {
      return {
        show: function() {
          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>',
            noBackdrop: false,
            hideOnStateChange: true
          });
        },

        hide: function() {
          $timeout(function() {
            $ionicLoading.hide();
          });
        }
      };
    }
  ]);
