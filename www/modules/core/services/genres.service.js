'use strict';

angular
  .module('core')
  .service('GenresSrv', ['$http', 'PATHS', '$rootScope',
    function($http, PATHS, $rootScope) {
      function getTranslations() {
        /*if ($rootScope.LOCALE.indexOf('es') === -1) {
          return ',translations(' + $rootScope.LOCALE + '(description))';
        }*/

        return '';
      }

      var allGenresFields = '';
      allGenresFields = '?fields=';
      allGenresFields += '_id,slug,title' + getTranslations();

      var genreHomeFields = '';
      genreHomeFields = '?fields=';
      genreHomeFields += 'currentGenre(_id,slides,slug,title' + getTranslations() + ($rootScope.IS_TABLET ? ',slides' : '') + ')';
      genreHomeFields += ',liveNow(url,liveId,liveFrameUrl,liveStreamUrl,image,title,program(_id,slogan,slug,title' + getTranslations() + '))';
      genreHomeFields += ',newNow(_id,description,logo,slogan,slug,title' + getTranslations() + ')';
      genreHomeFields += ',popularShows(_id,description,logo,slogan,slug,title' + getTranslations() + ')';
      genreHomeFields += ',popularVideos(_id,extraThumbParameters,link,slug,title,description,image,date,duration,program(_id,slogan,slug,title))';
      genreHomeFields += ',recentVideos(_id,extraThumbParameters,link,slug,title,description,image,date,duration,program(_id,slogan,slug,title))';
      genreHomeFields += ',featuredVideos(_id,extraThumbParameters,link,slug,title,description,image,program(_id,slogan,slug,title),video(_id,extraThumbParameters,link,slug,title,description,date,enabledForProducts,duration))';

      return {
        get: function(params) {
          params = params || {};
          if (params.genreSlug) {
            return this.getHome(params);
          }
          return $http.get(PATHS.GENRES + allGenresFields);
        },

        getHome: function(params) {
          params = params || {};
          return $http.get(PATHS.HOME + '/genre/' + params.genreSlug + genreHomeFields);
        }
      };
    }
  ]);
