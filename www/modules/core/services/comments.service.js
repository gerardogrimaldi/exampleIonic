'use strict';

angular
  .module('core')
  .service('CommentsSrv', ['$http', 'AuthSrv', 'PATHS',
    function($http, AuthSrv, PATHS) {
      function getSignHeader() {
        return {
          headers: AuthSrv.getSignature()
        };
      }

      function getPath(params) {
        var path = PATHS.API;

        switch (params.type) {
          case 'recording':
            path += '/recordings';
            break;
          case 'grouping':
            path += '/groupings';
            break;
          case 'video':
            path += '/videos';
            break;
          case 'program':
            path += '/programs';
            break;
          case 'blog':
            path += '/blogs';
            break;
        }

        return path + '/' + params.id + '/comments';
      }

      var fields = '';
      fields = '?fields=';
      fields += '_id,likeCount,profile,text';

      return {
        get: function(params) {
          params = params || {};
          return $http.get(getPath(params) + fields, {
            params: {
              lastId: params.lastId || undefined,
              skip: params.skip || undefined,
              limit: 5
            }
          });
        },

        add: function(comment) {
          return $http.post(PATHS.COMMENTS, comment, getSignHeader());
        },

        like: function(liking) {
          return $http.post(PATHS.LIKING, liking, getSignHeader());
        },

        report: function(report) {
          return $http.post(PATHS.REPORTS, report);
        }
      };
    }
  ]);
