'use strict';

angular
  .module('core')
  .service('ProductsSrv', ['$http', 'PATHS', 'AuthSrv',
    function ($http, PATHS, AuthSrv) {

      function getSignHeader() {
        return {
          headers: AuthSrv.getSignature()
        };
      }

      return {
        get: function (params) {
          if (params && params.productKey) {
            return this.getProduct(params);
          }
          return $http.get(PATHS.PRODUCTS, getSignHeader());
        },

        getByKey: function (params) {
          return $http.get(PATHS.PRODUCTS + '/key/' + params.productKey, getSignHeader());
        },

        getProduct: function (params) {
          return $http.get(PATHS.PRODUCTS + '/' + params.productKey, getSignHeader());
        }
      };
    }
  ]);
