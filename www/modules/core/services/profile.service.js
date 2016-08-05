'use strict';

angular
  .module('core')
  .service('ProfileSrv', ['$http', 'PATHS', 'AuthSrv', '$rootScope', '$window',
    function($http, PATHS, AuthSrv, $rootScope, $window) {
      var likings = [],
        videoViewed = [];

      function setVideoViewed() {
        var items = $window.localStorage.getItem('videoViewed');
        if (!angular.isArray(items)) {
          items = JSON.parse(items);
        }
        if (items && items.length) {
          videoViewed = items;
        }
      }

      setVideoViewed();

      function getSignHeader() {
        return {
          headers: AuthSrv.getSignature()
        };
      }

      function addVideoView(items) {
        var item = null,
          i = 0,
          l = items ? items.length : 0;

        for (i; i < l; i++) {
          item = items[i];
          if (videoViewed.indexOf(item) === -1) {
            videoViewed.push(item);
          }
        }

        $window.localStorage.setItem('videoViewed', JSON.stringify(videoViewed));

        return videoViewed;
      }

      function addLiking(liking) {
        var items = likings,
          item = null,
          i = 0,
          l = items ? items.length : 0,
          exist = false;

        for (i; i < l; i++) {
          item = items[i];
          if (item.program && liking.program && item.program._id === liking.program._id) {
            exist = true;
          } else if (item.video && liking.video && item.video._id === liking.video._id) {
            exist = true;
          } else if (item.recording && liking.recording && item.recording._id === liking.recording._id) {
            exist = true;
          }
        }

        if (!exist) {
          likings.push(liking);
          $rootScope.$broadcast('Profile:Likings:Set', likings);
        }

        return likings;
      }

      function removeLiking(programId) {
        var items = likings,
          item = null,
          i = 0,
          l = items ? items.length : 0;

        if (l) {
          for (i; i < l; i++) {
            item = items[i];
            if (item && item.program && programId === item.program._id) {
              likings.splice(i, 1);
            }
          }

          $rootScope.$broadcast('Profile:Likings:Set', likings);
        }
        return likings;
      }

      function syncVideoViewed(items) {
        return $http.post(PATHS.API + '/user-views', {
          videos: items || videoViewed
        }, getSignHeader());
      }

      return {
        setEmail: function(email) {
          return $http.post(PATHS.PROFILE + '/email', {
            email: email
          }, getSignHeader());
        },

        addVideoView: function(videoId) {
          if ($rootScope.USER && $rootScope.USER._id) {
            syncVideoViewed([videoId]);
          }

          return addVideoView([videoId]);
        },

        getViewedVideos: function() {
          return videoViewed;
        },

        setCurrentViewed: function(viewed) {
          addVideoView(viewed);
          syncVideoViewed();
        },

        confirmEmail: function(token) {
          return $http.post(PATHS.PROFILE + '/email/confirm', {
            token: token
          }, getSignHeader());
        },

        getLikings: function() {
          return $http.get(PATHS.LIKING, getSignHeader());
        },

        addLiking: function(liking) {
          addLiking(liking);
          return $http.post(PATHS.LIKING, liking, getSignHeader());
        },

        removeLiking: function(programId) {
          removeLiking(programId);
          return $http.delete(PATHS.LIKING + '/programs/' + programId, getSignHeader());
        },

        getDownloads: function() {
          return $http.get(PATHS.DOWNLOADS, {
            headers: AuthSrv.getSignature(),
            cache: false,
            offline: true
          });
        },

        addDownload: function(download) {
          return $http.post(PATHS.DOWNLOADS, download, getSignHeader());
        },

        removeDownload: function(videoId) {
          return $http.delete(PATHS.DOWNLOADS + '/' + videoId, getSignHeader());
        },

        getNotifications: function() {
          return $http.get(PATHS.PROFILE_NOTIFICATIONS, getSignHeader());
        },

        setNotification: function(notifiaction) {
          return $http.post(PATHS.PROFILE_NOTIFICATIONS + '/settings', notifiaction, getSignHeader());
        },

        setRead: function(items) {
          var ids = [],
            i = 0,
            l = items && items.length ? items.length : items;

          for (i; i < l; i++) {
            ids.push(items[i]._id);
          }

          return $http.post(PATHS.PROFILE_NOTIFICATIONS + '/read', {
            readIds: ids
          }, getSignHeader());
        },

        setFlag: function(params) {
          return $http.put(PATHS.API + '/profile/settings/flags', params, getSignHeader());
        },

        getPlayTimes: function(params) {
          return $http.get(PATHS.PLAY_TIMES + '/programs/' + params.showId, getSignHeader());
        },

        getCurrentLikings: function() {
          if (likings && likings.length) {
            return likings;
          } else if ($rootScope.USER && $rootScope.USER._id) {
            return $rootScope.USER.likings;
          }
          return [];
        },

        setCurrentLikings: function(items) {
          likings = items;
          $rootScope.$broadcast('Profile:Likings:ReSet', likings);
          return likings;
        },

        isProgramCurrentLiked: function(showId) {
          var items = likings,
            item = null,
            i = 0,
            l = items ? items.length : 0;

          if (l) {
            for (i; i < l; i++) {
              item = items[i];
              if (item.program && item.program._id === showId) {
                return true;
              }
            }
          }

          return false;
        }
      };
    }
  ]);
