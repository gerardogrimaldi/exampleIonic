'use strict';

angular
  .module('core')
  .service('AuthSrv', ['$rootScope', '$http', 'PATHS', 'AUTH', '$q', '$window', '$timeout', '$cordovaOauth', 'LoadingSrv', 'ErrorNotificationsSrv', '$cordovaFile',
    function($rootScope, $http, PATHS, AUTH, $q, $window, $timeout, $cordovaOauth, LoadingSrv, ErrorNotificationsSrv, $cordovaFile) {
      var devProfile = JSON.parse(
        '{"_id":"563b729ddab104030090952e","secret":"20bf4c6d644ca6decadd61100054302c8d37facd","date":"2015-11-05T15:15:41.245Z","name":"Nahuel Lema","image":"https://graph.facebook.com/10153395159029620/picture","internal":{"batchCheckDate":"2015-11-05T15:15:41.244Z"},"settings":{"flags":{"shownExplanation":false},"dontNotify":{"mobile":[],"web":[],"mail":[]}},"facebook":{"id":"10153395159029620","token":"CAAJ1V0hqHsIBAF87efeHDDP838dZBJzGo7ZCCWOLqOWErZALJKNGrcDsEbSPQ7rG37hgLEQjlUu840FfkeLAlgH1bFvN1ApGPo3BoYpLs37BEnACDbEb6PvZCEjooMJcTosis4WpirO1y3FWm3s2fwrcApQpyYKKX1MR6izBxciNdDw20LqlAN95GSsvLEsZD","name":"Nahuel Lema","image":"https://graph.facebook.com/10153395159029620/picture","data":{"id":"10153395159029620","picture":{"data":{"url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfa1/v/t1.0-1/p50x50/11755…da565370ef&oe=56B0BF14&__gda__=1454922386_05d5966f043f3ae4bd11298220f955b4","is_silhouette":false}},"gender":"male","name":"Nahuel Lema"}},"__v":0}');

      function randomString(length) {
        var text = '',
          possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
          i = 0;

        for (i; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
      }

      function signatureUser(profile) {
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

      function signatureProfile() {
        var vendorKey = AUTH.VENDOR_KEY,
          vendorSecret = AUTH.VENDOR_SECRET,
          ts = Date.now(),
          nonce = randomString(64),
          vendorSig = $window.CryptoJS.SHA512(vendorKey + vendorSecret + nonce + ts).toString();

        return {
          'x-vendor-sig': vendorSig,
          'x-vendor-ts': ts,
          'x-vendor-nonce': nonce,
          'x-vendor-apikey': vendorKey
        };
      }

      function getCurrentSession() {
        var session = $window.localStorage.getItem('session');

        if (session) {
          session = JSON.parse(session);
        } else {
          session = $rootScope.USER;
        }

        if (session && session.secret) {
          return session;
        }

        return false;
      }

      function getVendorProfile(params) {
        return $http.post(PATHS.API + '/vendors/profiles', params, {
          headers: signatureProfile(),
          cache: false
        });
      }

      function getMe(profile) {
        return $http.get(PATHS.API + '/me?extensions=likings,pendingNotifications,views', {
          headers: signatureUser(profile),
          cache: false
        });
      }

      function setSession(user) {
        $rootScope.$emit('App:Analytics', 'session', 'login', {
          provider: 'auth',
          bool: true
        });

        if ($window.ga) {
          $window.ga('set', '&uid', user._id);
        }

        $window.localStorage.setItem('session', JSON.stringify(user));

        if ($window.cordova) {
          $cordovaFile.writeFile(cordova.file.dataDirectory, 'session.json', JSON.stringify([user]), true)
            .then(function(success) {
              console.log('writeFileSuccess');
              console.log(success);
            }, function(error) {
              console.log('writeFileError');
              console.log(error);
            });
        }

        $rootScope.USER = user;
        $rootScope.$emit('Profile:Likings:Set', user.likings);
        $rootScope.$emit('Profile:Viewed:Set', user.views);
        $rootScope.$emit('Profile:Notifications:Get');

        LoadingSrv.hide();
      }

      return {
        get: function() {
          var vm = this,
            profile = getCurrentSession(),
            deferred = $q.defer();

          if (profile && profile._id) {
            $timeout(function() {
              getMe(profile)
                .then(function(prof) {
                  deferred.resolve(prof);
                  return vm.authSuccess(prof && prof.data ? prof.data : prof);
                }, function(data) {
                  deferred.reject(data);
                  return vm.authFailed();
                });
            });
            return deferred.promise;
          }
          return false;
          //resetSession();
        },

        getDevProfile: function() {
          var self = this;
          if(!$window.FWTV_PROD) {
            getMe(devProfile)
              .then(function (User) {
                setSession(User && User.data ? User.data : User);
                self.getProfileProductsEnable().then(function () {
                  $rootScope.OFFLINE_MODE = window.FWTV_PRODUCTS;
                });
              });
          }
        },

        getProfile: function() {
          return getCurrentSession();
        },

        getLocalProfile: function() {
          if ($window.FWTV_QA || $window.FWTV_PROD) {
            return $cordovaFile.readAsText(cordova.file.dataDirectory, 'session.json');
          }
          return false;
        },

        getProfileProductsEnable: function() {
          return $http.get(PATHS.PROFILE_PRODUCTS_ENABLE, {
            headers: signatureUser(getCurrentSession()),
            cache: false
          });
        },

        getSignature: function() {
          var profile = getCurrentSession();

          if (profile) {
            return signatureUser(profile);
          }

          return {};
        },

        facebookLogin: function() {
          var self = this;

          $rootScope.$emit('App:Analytics', 'session', 'login', {
            provider: 'facebook'
          });

          LoadingSrv.show();

          if ($window.cordova) {
            $cordovaOauth
              .facebook(AUTH.FACEBOOK_CLIENT_KEY, ['email', 'public_profile', 'user_friends'])
              .then(function(result) {
                var token = result.access_token;

                $http.get(AUTH.FACEBOOK_ME, {
                  params: {
                    access_token: token,
                    fields: 'name,gender,location,picture',
                    format: 'json'
                  }
                }).then(function(res) {
                  getVendorProfile({
                    provider: 'facebook',
                    providerToken: token,
                    facebookProfile: res.data,
                    idAtProvider: res.data.id
                  }).then(function(profile) {
                    self.authSuccess(profile && profile.data ? profile.data : profile);
                  }, function(err) {
                    ErrorNotificationsSrv.show('login:facebook:3', err);
                    self.authFailed();
                  });
                }, function(err) {
                  ErrorNotificationsSrv.show('login:facebook:2', err);
                  self.authFailed();
                });
              }, function(err) {
                ErrorNotificationsSrv.show('login:facebook:1', err);
                self.authFailed();
              });
          } else {
            this.getDevProfile();
          }
        },

        twitterLogin: function() {
          var self = this;

          $rootScope.$emit('App:Analytics', 'session', 'login', {
            provider: 'twitter'
          });

          LoadingSrv.show();
          if (window.cordova) {
            $cordovaOauth
              .twitter(AUTH.TWITTER_CONSUMER_KEY, AUTH.TWITTER_CONSUMER_SECRET)
              .then(function (result) {
                getVendorProfile({
                  provider: 'twitter',
                  providerToken: result.oauth_token,
                  twitterProfile: {
                    token: result.oauth_token,
                    screen_name: result.screen_name,
                    id: result.user_id
                  },
                  idAtProvider: result.user_id
                }).then(function (profile) {
                  self.authSuccess(profile && profile.data ? profile.data : profile);
                }, function (err) {
                  ErrorNotificationsSrv.show('login:twitter:2', err);
                  self.authFailed();
                });
              }, function (err) {
                ErrorNotificationsSrv.show('login:twitter:1', err);
                self.authFailed();
              });
          } else {
            this.getDevProfile();
          }
        },

        authSuccess: function(userData) {
          if (userData.banned || userData.profile && userData.profile.banned) {
            $rootScope.$emit('App:Analytics', 'session', 'banned');
          } else {
            getMe(userData.profile || userData).then(function(User) {
              setSession(User && User.data ? User.data : User);
            });
          }
        },

        authFailed: function() {
          $rootScope.$emit('App:Analytics', 'session', 'login', {
            provider: 'auth',
            bool: false
          });
          ErrorNotificationsSrv.show('login:error');
          LoadingSrv.hide();
        },

        authLogout: function() {
          if ($window.cordova) {
            $cordovaFile.removeFile(cordova.file.dataDirectory, 'session.json')
              .then(function(success) {
                $rootScope.$emit('App:Analytics', 'session', 'logout');
                $rootScope.USER = null;
                $rootScope.$broadcast('App:User:Logout');
                $rootScope.$broadcast('Profile:Likings:Set', []);
              }, function(error) {
                console.log('deleteFileError');
                console.log(error);
              });
            $cordovaOauth.logout();
          }
        }
      };
    }
  ]);
