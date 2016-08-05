'use strict';

angular
  .module('core')
  .service('UserPicturesSrv', ['$http', 'AuthSrv', 'PATHS', 'LimitSrv',
    function($http, AuthSrv, PATHS, LimitSrv) {
      var getUserPicturesFields = '';
      getUserPicturesFields = '?fields=';
      getUserPicturesFields += '_id,image,profile,thumb,voteCount,date';

      return {
        get: function(params) {
          params = params || {};

          if (params.userPictureId) {
            return $http.get(PATHS.USER_PICTURES + '/' + params.userPictureId);
          }

          return $http.get(PATHS.API + '/programs/' + params.showId + '/user-pictures' + getUserPicturesFields, {
            params: {
              limit: params.limit || LimitSrv.get(),
              lastId: params.lastId,
              skip: params.skip
            },
            cache: false
          });
        },

        addContest: function(imageData, contest, program) {
          return $http.post(PATHS.USER_PICTURES, {
            programId: program._id,
            contest: contest,
            image: imageData.image,
            thumb: imageData.thumb
          }, {
            headers: AuthSrv.getSignature()
          });
        },

        vote: function(params) {
          return $http.post(PATHS.USER_PICTURES + '/' + params.userPictureId + '/vote', null, {
            headers: AuthSrv.getSignature()
          });
        },

        hasVoted: function(params) {
          return $http.get(PATHS.USER_PICTURES + '/' + params.userPictureId + '/has-voted', {
            headers: AuthSrv.getSignature()
          });
        }
      };
    }
  ]);
