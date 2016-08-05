'use strict';

angular
  .module('core')
  .service('LocationParamsSrv', [
    function() {
      return {
        get: function(key) {
          var search = location.search,
            searchArr = null,
            pairArr = null,
            found = null;

          if (search) {
            search = search.replace('?', '');
            searchArr = search.split('&');
            searchArr.forEach(function(s) {
              pairArr = s.split('=');
              if (pairArr[0] && pairArr[1] && key === pairArr[0]) {
                found = pairArr[1];
                found = decodeURIComponent(found);
              }
            });
          }

          return found;
        }
      };
    }
  ]);
