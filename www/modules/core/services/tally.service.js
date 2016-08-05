'use strict';

angular
  .module('core')
  .service('TallySrv', ['$location', '$rootScope', '$http', 'AuthSrv', 'PATHS', 'LogSrv',
    function($location, $rootScope, $http, AuthSrv, PATHS, LogSrv) {
      var pageLoads = 0;

      return {
        loadPage: function() {
          pageLoads++;
          if (pageLoads > 1) {
            if ($location.$$search.t) {
              delete $location.$$search.t;
              $location.$$compose();
            }
          }
        },

        getLoads: function() {
          return pageLoads;
        },

        visitVideo: function(params) {
          var video = params.video,
            show = params.show,
            visit = {
              video: video,
              type: params.type
            };

          if (angular.isObject(video)) {
            if (video._id) {
              visit.video = video._id;
              visit.program = video.program;
            }
          }
          if (show && show._id) {
            visit.program = show._id;
          }

          LogSrv.visit(visit);
        },

        visitRecording: function(recording) {
          var visit = {
            recording: recording
          };

          if (angular.isObject(recording)) {
            visit.recording = recording._id;
            visit.program = recording.program;
          }

          LogSrv.visit(visit);
        },

        updatePlaytime: function(visit, playTime, isSeries) {
          visit.playTime = playTime;

          /*if (Math.floor(playTime / 60) >= 3) {
            Angularytics.trackEvent('Tiempo de reproduccion', 'Tiempo de reproduccion de ' + Math.floor(playTime / 60) + ' minutos');
          }*/

          if (isSeries && $rootScope.USER) {
            $http.put(PATHS.VISIT, visit, {
              headers: AuthSrv.getSignature()
            });
          }

          LogSrv.playTime(visit);
        }
      };
    }
  ]);
