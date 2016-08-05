'use strict';

angular
  .module('core')
  .service('LogSrv', ['$http', '$location', '$rootScope', 'SessionSrv', 'TREASUREDATA', 'TELIZE',
    function($http, $location, $rootScope, SessionSrv, TREASUREDATA, TELIZE) {
      var db = 'dev';

      function setDB() {
        var host = $location.host();

        if (host === 'www.fwtv.tv') {
          db = 'prod';
        } else {
          db = 'qatest';
        }

        return db;
      }

      setDB();

      function setWatchedVideosIds(id) {
        var items = $rootScope.WATCHED_VIDEO_IDS;

        if (!items) {
          items = [];
        }

        if (items.indexOf(id) === -1) {
          items.push(id);
          if (items.length > 50) {
            items.shift();
          }
          items.sort();
        }

        $rootScope.WATCHED_VIDEO_IDS = items;
      }

      return {
        send: function(event, options) {
          var table = options && options.table || 'log',
            profile = SessionSrv.getProfile(),
            geo = $rootScope.geo;

          if (!event) {
            return false;
          }

          if (geo) {
            event.latitude = geo.latitude;
            event.longitude = geo.longitude;
            event.ip = geo.ip;
            event.country = geo.country_code;
          }

          event.time = event.time || Math.floor(new Date().getTime() / 1000);
          event.path = event.path || $location.path();
          event.session = event.session || $rootScope.uniqueSessionId;
          event.device = 'web';

          if (!event.profile && profile && profile._id) {
            event.profile = profile._id;
          }

          $http.post(TREASUREDATA.API + '/' + db + '/' + table, event, {
            headers: {
              'X-TD-WRITE-KEY': TREASUREDATA.WRITE_KEY
            }
          });
        },

        event: function(event, options) {
          var vm = this;

          if (!$rootScope.geo && !$rootScope.triedGeo) {
            $rootScope.triedGeo = true;

            $http.get(TELIZE.API)
              .then(function(geo) {
                if (geo) {
                  $rootScope.geo = geo;
                }
                vm.send(event, options);
              }, function() {
                vm.send(event, options);
              });
          } else {
            vm.send(event, options);
          }
        },

        action: function(action) {
          this.event(action, {
            table: 'actions'
          });
        },

        playTime: function(visit) {
          var playTime = {
            program: visit.program,
            playtime: visit.playTime,
            type: visit.type
          };

          if (visit.video) {
            playTime.video = visit.video;
          }

          if (visit.seekTime) {
            playTime.seektime = visit.seekTime;
          }

          if (visit.duration) {
            playTime.duration = visit.duration;
          }

          this.event(playTime, {
            table: 'playtimes'
          });
        },

        visit: function(visit) {
          var event = {
            type: visit.type
          };

          if (visit.video) {
            event.video = visit.video._id ? visit.video._id : visit.video;

            if (event.video) {
              setWatchedVideosIds(event.video);
            }

            if (angular.isObject(event.video)) {
              delete event.video;
            }
          }

          if (visit.program) {
            event.program = visit.program;
          }

          if (visit.recording) {
            event.recording = visit.recording._id ? visit.recording._id : visit.recording;
            if (angular.isObject(event.recording)) {
              delete event.recording;
            }
          }

          this.event(event);
        }
      };
    }
  ]);
