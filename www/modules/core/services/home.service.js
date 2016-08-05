'use strict';

angular
  .module('core')
  .service('HomeSrv', ['$http', 'PATHS', '$q', '$rootScope',
    function($http, PATHS, $q, $rootScope) {
      function getTranslations() {
        if ($rootScope.LOCALE && $rootScope.LOCALE.indexOf('es') === -1) {
          return ',translations(' + $rootScope.LOCALE + '(description))';
        }

        return '';
      }

      var fields = '';
      fields = '?fields=';
      fields += $rootScope.IS_TABLET ? 'landing,' : '';
      fields += 'liveNow(_id,url,liveId,liveFrameUrl,liveStreamUrl,image,title,program(_id,slug,title,slogan' + getTranslations() + '))';
      fields += ',newNow(_id,logo,slug,title,description,slogan' + getTranslations() + ')';
      fields += ',popularShows(_id,logo,slug,title,description,slogan' + getTranslations() + ')';
      fields += ',popularVideos(_id,link,slug,title,image,date,duration,program(_id,slug,title))';
      fields += ',recentVideos(_id,link,slug,title,image,date,duration,program(_id,slug,title))';
      fields += ',featuredVideos(_id,link,slug,title,image,program(_id,slug,title),video(_id,link,slug,title,date,enabledForProducts,duration))';

      return {
        get: function() {
          return $http.get(PATHS.HOME + fields);
        }
      };
    }
  ]);
