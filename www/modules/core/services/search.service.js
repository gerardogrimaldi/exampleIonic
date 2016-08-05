'use strict';

angular
  .module('core')
  .service('SearchSrv', ['ALGOLIA', '$q', '$window', 'ListGeneratorsSrv',
    function(ALGOLIA, $q, $window, ListGeneratorsSrv) {
      var engine = null;

      function init() {
        engine = algoliasearch(ALGOLIA.APP_ID, ALGOLIA.API_KEY).initIndex('videos');
        return engine;
      }

      if ($window.algoliasearch) {
        init();
      }

      return {
        videos: function(params, page) {
          var deferred = $q.defer();

          if (!engine) {
            init();
          }

          engine.search(params.query, {
            hitsPerPage: ListGeneratorsSrv.getItemsPerRow() * 2,
            page: page || 0
          }, function(err, content) {
            if (content) {
              deferred.resolve(content);
            } else {
              deferred.reject(content);
            }
          });

          return deferred.promise;
        }
      };
    }
  ]);
