'use strict';

angular
  .module('core')
  .service('UserWachedSrv', ['$rootScope', 'ProfileSrv',
    function($rootScope, ProfileSrv) {

      function check(link) {
        var viewed = ProfileSrv.getViewedVideos(),
          i = 0,
          l = viewed.length;

        for (i; i < l; i++) {
          if (viewed[i] === link) {
            return true;
          }
        }

        return false;
      }

      return {
        find: function(items) {
          var newItems = [],
            item = null,
            viewed = ProfileSrv.getViewedVideos(),
            i = 0,
            l = items ? items.length : 0;

          if (items && (viewed && viewed.length)) {
            for (i; i < l; i++) {
              item = items[i];
              item.isWatched = angular.isString(item) ? check(item) : check(item.link || (item.video && item.video.link) || item._id);
              newItems.push(item);
            }

            return newItems;
          }

          return items;
        }
      };
    }
  ]);
