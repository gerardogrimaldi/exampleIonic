'use strict';

angular
  .module('core')
  .service('SessionSrv', ['$rootScope', '$http', 'PATHS', '$q', '$window', '$timeout', 'ErrorNotificationsSrv',
    function($rootScope, $http, PATHS, $q, $window, $timeout, ErrorNotificationsSrv) {

      function randomString(length) {
        var text = '',
          possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
          i = 0;

        for (i; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
      }

      function getCurrentSession() {
        var session = $rootScope.USER;
        if (session && session.secret) {
          return session;
        }

        return false;
      }

      function resetSession() {
        $rootScope.USER = null;
        $rootScope.$broadcast('Profile:Likings:Set', []);
      }

      resetSession();

      function socialLogin(name) {
        var url = '/auth/' + name,
          width = 1000,
          height = 650,
          top = ($window.outerHeight - height) / 2,
          left = ($window.outerWidth - width) / 2;

        $window.open(url, name + '_login', 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left + ',scrollbars=0');
      }

      function signature(profile) {
        var ts = new Date().getTime(),
          nonce = randomString(20),
          sigString = profile._id + profile.secret + nonce + ts;

        return {
          'x-sig': $window.CryptoJS.SHA512(sigString).toString(),
          'x-ts': ts,
          'x-nonce': nonce,
          'x-profileid': profile._id
        };
      }

      function showFirstLoginDialog() {
        var yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).getTime(),
          now = new Date().getTime(),
          userDate = new Date($rootScope.USER.date).getTime();

        if ($rootScope.USER.settings && (!$rootScope.USER.settings.flags || !$rootScope.USER.settings.flags.shownExplanation)) {
          $rootScope.$emit('App:Dialogs:Login:First:Open', {
            newUser: userDate >= yesterday && now <= userDate
          });
        }
      }

      return {
        get: function() {
          var vm = this,
            profile = getCurrentSession(),
            deferred = $q.defer();

          if (profile && profile._id) {
            $timeout(function() {
              $http.get(PATHS.API + '/me?extensions=likings,pendingNotifications,views', {
                  headers: signature(profile),
                  cache: false
                })
                .then(function(profile) {
                  deferred.resolve(profile);
                  return vm.authSuccess(profile && profile.data ? profile.data : profile);
                }, function(data) {
                  deferred.reject(data);
                  return vm.authFailed();
                });
            });
            return deferred.promise;
          }
          resetSession();
        },

        getProfile: function() {
          return getCurrentSession();
        },

        getSignature: function() {
          var profile = getCurrentSession();
          if (profile) {
            return signature(profile);
          }

          return {};
        },

        facebookLogin: function() {
          $rootScope.$emit('App:Analytics', 'session', 'login', {
            provider: 'facebook'
          });

          socialLogin('facebook');
        },

        twitterLogin: function() {
          $rootScope.$emit('App:Analytics', 'session', 'login', {
            provider: 'twitter'
          });

          socialLogin('twitter');
        },

        authSuccess: function(userData) {
          if (userData.banned) {
            $rootScope.$emit('App:Analytics', 'session', 'banned');
          } else {
            $rootScope.$emit('App:Analytics', 'session', 'login', {
              provider: 'auth',
              bool: true
            });

            if ($window.ga) {
              $window.ga('set', '&uid', userData._id);
            }

            $rootScope.USER = userData;
            $rootScope.$emit('Profile:Likings:Set', userData.likings);
            $rootScope.$emit('Profile:Viewed:Set', userData.views);
            $rootScope.$emit('Profile:Notifications:Get');
            showFirstLoginDialog();
          }
        },

        authFailed: function() {
          resetSession();
          $rootScope.$emit('App:Analytics', 'session', 'login', {
            provider: 'auth',
            bool: false
          });
          ErrorNotificationsSrv.show('login:error');
        },

        logout: function() {
          resetSession();
          $rootScope.$emit('App:Analytics', 'session', 'logout');
          $rootScope.$broadcast('App:User:Logout');

          if ($window.ga) {
            $window.ga('set', '&uid', null);
          }
        }
      };
    }
  ]);
