'use strict';

angular
  .module('core')
  .factory('AdsSrv', ['$http', 'E_PLANNING', '$ionicModal', '$rootScope', '$window',
    function ($http, E_PLANNING, $ionicModal, $rootScope, $window) {
      var $adModal = null,
        ads = null,
        adCount = 0,
        pageCount = 0,
        pageLimit = 6;

      function setAds(data) {
        if (data.status === 'ok' && data.ads.length) {
          ads = data.ads;
        }
      }

      function showModal(ad) {
        if (!$window.FWTV_PROD) {
          ad = {
            content: '<a target="_blank" href="http: //ads.e-planning.net/ei/3/13fd8/353e8d989b4e14ec?ct=1&pb=6ebe0b621d9d1479&fi=fa1030bebb2423eb&i=93baf0a09c9713a3"><img src="http://i.e-planning.net/esb/4/1/13ba1/b9c6ce600e8bffdf.jpg" border="0" width="320" height="480" alt="Banner_Interstitial_BBVA_320x480_04112015"></a>',
            height: 480,
            type: 'banner',
            width: 320
          };
        }

        if (ad) {
          if ($adModal) {
            $adModal.hide();
          }

          $rootScope.AD_CONTENT = ad.content;

          $ionicModal.fromTemplateUrl('modules/core/views/ads.view.html', {
            scope: $rootScope,
            animation: 'slide-in-up'
          }).then(function (modal) {
            $adModal = modal;
            $adModal.show();
          });

          $rootScope.onClickCloseAdModal = function () {
            $adModal.hide();
          };

          $rootScope.$on('$destroy', function () {
            $adModal.remove();
          });
        }
      }

      function getAd() {
        if (ads && ads.length && ads[adCount + 1]) {
          adCount++;
        } else {
          adCount = 0;
        }

        return ads && ads[adCount] ? ads[adCount] : false;
      }

      return {
        get: function () {
          return $http.get(E_PLANNING.API).then(function (data) {
            setAds(data && data.data);
          });
        },
        show: function () {
          if (!ads) {
            this.get();
          }

          pageCount++;

          if (pageCount >= pageLimit) {
            pageCount = 0;
            showModal(getAd());
          }
        }
      };
    }
  ]);
