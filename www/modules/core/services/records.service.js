'use strict';

angular
  .module('core')
  .service('RecordsSrv', ['$http', 'PATHS',
    function($http, PATHS) {
      return {
        add: function(recording) {
          return $http.post(PATHS.RECORDINGS, recording);
        }
      };
    }
  ]);
