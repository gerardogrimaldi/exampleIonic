'use strict';

angular
  .module('core')
  .service('PaymentsSrv', ['$http', 'PATHS', 'AuthSrv',
    function ($http, PATHS, AuthSrv) {

      function getSignHeader() {
        return {
          headers: AuthSrv.getSignature()
        };
      }

      return {
        set: function (params) {
          return $http.post(PATHS.PAYMENTS, {
            gateway: 'mercadopago',
            productKey: params.productKey,
            vendorCallbackUrl: 'fwtv-app://'
          }, getSignHeader());
        },

        setTrial: function (params) {
          return $http.post(PATHS.PAYMENTS_TRIAL, {}, getSignHeader());
        },

        get: function (params) {
          return $http.get(PATHS.PAYMENTS + params.paymentId, getSignHeader());
        },

        getProfileProductsEnable: function (params) {
          return $http.get(PATHS.PAYMENTS + '/profiles/products/enabled', getSignHeader());
        },

        getProfileVideoEnable: function (params) {
          return $http.get(PATHS.PAYMENTS + '/videos/' + params.videoId + '/enabled', getSignHeader());
        }
      };
    }
  ]);
