'use strict';

angular
  .module('core')
  .service('RateAppSrv', ['$rootScope', '$ionicPopup', '$window',
    function($rootScope, $ionicPopup, $window) {
      var count = 0,
        limit = 5;

      return {
        show: function() {
          var hasRate = $window.localStorage.getItem('APP_RATE');

          if ((!hasRate || hasRate !== 'true') && count >= limit) {
            $ionicPopup.confirm({
              title: '¿Podrias calificar nuestra APP?',
              template: 'Te llevara solo unos segundos',
              cssClass: 'rate-app-container',
              cancelText: 'Mas tarde',
              okText: 'Aceptar',
              okType: 'button-energized'
            }).then(function(res) {
              if (res) {
                if ($rootScope.IS_IOS) {
                  $window.open('itms-apps://itunes.apple.com/ar/app/fwtv/id761259953?mt=8');
                } else {
                  $window.open('market://details?id=tv.fansworld.mobile.client');
                }
                $window.localStorage.setItem('APP_RATE', true);
              } else {
                count = 0;
                limit += 3;
              }
            });
          } else {
            count++;
          }
        }
      };
    }
  ]);
