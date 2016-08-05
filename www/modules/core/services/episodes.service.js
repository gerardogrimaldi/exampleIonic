'use strict';

angular
  .module('core')
  .service('EpisodesSrv', ['$http', 'PATHS', 'LimitSrv',
    function($http, PATHS, LimitSrv) {

      return {
        get: function(params) {
          return this.getAll(params);
        },

        getAll: function(params) {
          params = params || {};
          return $http.get(PATHS.SHOW + '/' + params.showId + '/episodes', {
            params: {
              limit: params.limit || LimitSrv.get(),
              lastId: params.lastId,
              skip: params.skip
            }
          });
        }
      };
    }
  ]);
