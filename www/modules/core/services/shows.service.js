'use strict';

angular
  .module('core')
  .service('ShowsSrv', ['$http', 'PATHS', '$location', 'LocationParamsSrv', 'LimitSrv', '$rootScope',
    function($http, PATHS, $location, LocationParamsSrv, LimitSrv, $rootScope) {

      function getTranslations() {
        if ($rootScope.LOCALE && $rootScope.LOCALE.indexOf('es') === -1) {
          return ',translations(' + $rootScope.LOCALE + '(description))';
        }

        return '';
      }

      var getShowFields = '';
      getShowFields = '?fields=';
      getShowFields += '_id,title,description,heroDescription,logo,slogan,slug,userPicturesConfig,isNewProgram,isSeries,isSpecial';
      getShowFields += ',liveId,liveFrameUrl,superCategories,videoCategories,photoCategories,commentCount,social,pubnub,featured';
      getShowFields += ',blogSection';
      getShowFields += ',schedule';
      getShowFields += ',recordingCategories,recordingSection,recordingSectionTitle';
      getShowFields += ',design(banner,bannerLink)';
      getShowFields += ',seasons(_id,chapterShowNumber,description,image,extras,number,title,categories,defaultCategory';
      getShowFields += ',chapters(_id,title,description,link,categories,chapter,extraThumbParameters,slug,date,duration)';
      getShowFields += ',videos(_id,title,description,link,slug,date,duration,extraThumbParameters,categories))';
      getShowFields += ',episodes(_id,image,promoPhoto,slug,title,videos(video(_id,title,link,slug,categories,genres,extraThumbParameters,date,duration)))';
      getShowFields += ',photos(_id,categories,file,slug,title,thumb)';
      getShowFields += ',videos(_id,title,link,slug,categories,genres,extraThumbParameters,date,duration)';
      getShowFields += getTranslations();

      var getAllShowFields = '';
      getAllShowFields = '?fields=';
      getAllShowFields += '_id,title,description,logo,slogan,slug,isNewProgram,isSeries,isSpecial';
      getAllShowFields += ',genres(_id,slug,title' + getTranslations() + ')';
      getAllShowFields += getTranslations();

      var getShowListPhotosFields = '';
      getShowListPhotosFields = '?fields=';
      getShowListPhotosFields += '_id,title,description,logo,slogan,slug,userPicturesConfig,defaultPhotosCategory,photoCategories,recordingSection,recordingSectionTitle,blogSection';
      getShowListPhotosFields += ',design(banner,bannerLink)';
      getShowListPhotosFields += ',currentSeason,filteredCategories';
      getShowListPhotosFields += ',photos(_id,categories,file,slug,title,thumb)';

      var getShowListVideosFields = '';
      getShowListVideosFields = '?fields=';
      getShowListVideosFields += '_id,title,description,logo,slogan,slug,userPicturesConfig,defaultVideoCategory,videoCategories,recordingSection,recordingSectionTitle,blogSection';
      getShowListVideosFields += ',currentSeason,filteredCategories';
      getShowListVideosFields += ',design(banner,bannerLink)';
      getShowListVideosFields += ',videos(_id,categories,genres,title,description,slug,extraThumbParameters,link,date,duration)';

      var getShowListEpisodesFields = '';
      getShowListEpisodesFields = '?fields=';
      getShowListEpisodesFields += '_id,title,description,logo,slogan,slug,userPicturesConfig,defaultVideoCategory,videoCategories,recordingSection,recordingSectionTitle,blogSection';
      getShowListEpisodesFields += ',design(banner,bannerLink)';
      getShowListEpisodesFields += ',currentSeason,filteredCategories';
      getShowListEpisodesFields += ',episodes(_id,promoPhoto,slug,title,date,duration,videos(video(_id,title,slug))';

      var getVideosFields = '';
      getVideosFields = '?fields=';
      getVideosFields += '_id,categories,description,extraThumbParameters,genres,link,slug,title,date,duration';

      var getPhotosFields = '';
      getPhotosFields = '?fields=';
      getPhotosFields += '_id,categories,file,slug,thumb,title';

      var getEpisodesFields = '';
      getEpisodesFields = '?fields=';
      getEpisodesFields += '_id,promoPhoto,slug,title,videos(video(_id,title,slug))';

      var getRelatedFields = '';
      getRelatedFields = '?fields=';
      getRelatedFields += '_id,categories,description,extraThumbParameters,genres,link,slug,title,date,duration,program(slug,title)';

      var getBlogsFields = '';
      getBlogsFields = '?fields=';
      getBlogsFields += '_id,logo,slogan,slug,title,description,blogSection,recordingSection,recordingSectionTitle,blogConfig';
      getBlogsFields += ',design(banner,bannerLink)';
      getBlogsFields += ',blogs(_id,date,image,content,slug,title,commentCount)';
      getBlogsFields += getTranslations();

      var getBlogFields = '';
      getBlogFields = '?fields=';
      getBlogFields += '_id,blog,blogSection,description,logo,slogan,slug,title,social';
      getBlogFields += ',blogs(_id,date,image,slug,title)';
      getBlogFields += ',design(banner,bannerLink)';
      getBlogFields += ',recordingCategories,recordingSection,recordingSectionTitle,recordingWidget';
      getBlogFields += getTranslations();

      var getVideoFields = '';
      getVideoFields = '?fields=';
      getVideoFields += '_id,commentCount,description,heroDescription,interactivities,likeCount,slogan,slug,title,social';
      getVideoFields += ',design(banner,bannerLink)';
      getVideoFields += ',nextVideo(_id,categories,extraThumbParameters,likeCount,link,slug,title,program(_id,slug,title))';
      getVideoFields += ',liveDescription,liveFrameUrl,liveId,liveImage,liveTitle,logo,playlistId,pubnub';
      getVideoFields += ',related(_id,categories,description,link,slug,title,date,duration,program(_id,slug,title))';
      getVideoFields += ',featured(_id,categories,commentCount,description,extraThumbParameters,likeCount,link,longDescription,slug,title,date,duration,youtubeId,threesixty)';
      getVideoFields += ',episode(_id,image,promoPhoto,slug,title,videos(_id,video(_id,title,description,link,slug,categories,genres,extraThumbParameters)))';
      getVideoFields += getTranslations();

      var getEpisodeFields = '';
      getEpisodeFields = '?fields=';
      getEpisodeFields += '_id,slogan,slug,title,description,social';
      getEpisodeFields += ',liveDescription,liveFrameUrl,liveId,liveImage,liveTitle,logo,playlistId,pubnub';
      getEpisodeFields += ',design(banner,bannerLink)';
      getEpisodeFields += ',episode(_id,image,promoPhoto,slug,title,videos(_id,video(_id,title,description,link,slug,categories,genres,extraThumbParameters,date,duration)))';
      getEpisodeFields += getTranslations();

      var getRecordingsShowFields = '';
      getRecordingsShowFields = '?fields=';
      getRecordingsShowFields += '_id,title,description,logo,slogan,slug,userPicturesConfig,isNewProgram,isSeries,isSpecial,cameraTag';
      getRecordingsShowFields += ',liveId,liveFrameUrl,commentCount,social,pubnub,featured';
      getRecordingsShowFields += ',blogs,blogSection';
      getRecordingsShowFields += ',design(banner,bannerLink)';
      getRecordingsShowFields += ',photos(_id,categories,file,slug,title,thumb)';
      getRecordingsShowFields += ',videos(_id,title,link,slug,categories,genres,extraThumbParameters,date,duration)';
      getRecordingsShowFields += ',recordingCategories,recordingDefaultCategory,recordingContest,recordingSection,recordingSectionTitle,recordingWidget,recordingUploadDisabled,recordingLikingDisabled';
      getRecordingsShowFields += ',topRecordings(_id,category,likeCount,image,profile,slug,title)';
      getRecordingsShowFields += getTranslations();

      var getRecordingsFields = '';
      getRecordingsFields = '?fields=';
      getRecordingsFields += '_id,category,image,link,profile,slug,title,likeCount';

      var getRecordingFields = '';
      getRecordingFields = '?fields=';
      getRecordingFields += '_id,cameraTag,commentCount,description,logo,slogan,slug,userPicturesConfig,social,pubnub,blogSection,title';
      getRecordingFields += ',design(banner,bannerLink)';
      getRecordingFields += ',recording,recordingCategories,recordingDefaultCategory,recordingContest,recordingSection,recordingSectionTitle,recordingWidget,sameCategoryRecordings,recordingUploadDisabled,recordingLikingDisabled';
      getRecordingFields += ',topRecordings(_id,category,likeCount,image,profile,slug,title)';
      getRecordingFields += getTranslations();

      var getGroupsFields = '';
      getGroupsFields = '?fields=';
      getGroupsFields += '_id,title,description,slug,programs';
      getGroupsFields += ',videos(_id,categories,genres,image,link,slug,title,extraThumbParameters,date,duration,program(_id,description,isSeries,logo,series,slug,title))';

      var getShowLegalFields = '';
      getShowLegalFields = '?fields=';
      getShowLegalFields += '_id,title,description,logo,slogan,slug,userPicturesConfig,recordingContest,recordingTerms';
      getShowLegalFields += getTranslations();

      function getBase(params) {
        return params.programSlug ? PATHS.SHOW + '/' + params.programSlug : PATHS.PROGRAMS + '/' + params.showId;
      }

      function hasPreview(params) {
        params = params || {};
        params.preview = params.preview || $location.search().preview;
        return !!params.preview;
      }

      function getCategories(params) {
        params.season = params.season || LocationParamsSrv.get('season');
        params.category = params.category || LocationParamsSrv.get('category');
        return params;
      }

      function getList(params, endpoint) {
        return $http.get(PATHS.SHOW + '/' + params.programSlug + '/list/' + endpoint, {
          params: {
            limit: params.limit || LimitSrv.get(),
            lastId: params.lastId,
            category: params.category || LocationParamsSrv.get('category'),
            season: params.season || LocationParamsSrv.get('season'),
            skip: params.skip
          }
        });
      }

      return {
        get: function(params) {
          params = params || {};

          if (params.episodeSlug) {
            return this.getEpisode(params);
          }

          if (params.videoSlug) {
            return this.getVideo(params);
          }

          if (params.programSlug) {
            if (hasPreview(params)) {
              return this.getPreview(params);
            }

            return $http.get(getBase(params) + getShowFields);
          }

          return $http.get(PATHS.PROGRAMS + getAllShowFields);
        },

        getBlogs: function(params) {
          if (params.blogSlug) {
            return this.getBlog(params);
          }
          return $http.get(getBase(params) + '/blog' + getBlogsFields);
        },

        getBlog: function(params) {
          return $http.get(getBase(params) + '/blog' + '/' + params.blogSlug + getBlogFields);
        },

        getRecordings: function(params) {
          if (params.recordingId) {
            return this.getRecording(params);
          }

          return $http.get(getBase(params) + '/recording-show' + getRecordingsShowFields + (params.category ? '&category=' + params.category : ''));
        },

        getRecording: function(params) {
          return $http.get(getBase(params) + '/recording-show/' + params.recordingId + getRecordingFields + (params.category ? 'category=' + params.category : ''));
        },

        getRecords: function(params) {
          return $http.get(getBase(params) + '/recordings' + getRecordingsFields, {
            params: {
              limit: params.limit || LimitSrv.get(),
              lastId: params.lastId,
              skip: params.skip,
              category: params.category
            }
          });
        },

        getEpisodes: function(params) {
          if (params.episodeSlug) {
            return this.getEpisode(params);
          }

          return $http.get(PATHS.SHOW + '/' + params.showId + '/episodes' + getEpisodesFields, {
            params: {
              limit: params.limit || LimitSrv.get(),
              lastId: params.lastId,
              skip: params.skip
            },
            cache: false
          });
        },

        getEpisode: function(params) {
          return $http.get(getBase(params) + '/episode/' + params.episodeSlug + getEpisodeFields);
        },

        getVideos: function(params) {
          //params = getCategories(params || {});
          params = params || {};
          return $http.get(getBase(params) + '/videos' + getVideosFields, {
            params: {
              limit: params.limit || LimitSrv.get(),
              lastId: params.lastId,
              category: params.category,
              season: params.season,
              skip: params.skip
            },
            cache: false
          });
        },

        getVideo: function(params) {
          return $http.get(getBase(params) + '/' + params.videoSlug + getVideoFields);
        },

        getRelatedVideos: function(params) {
          return $http.get(getBase(params) + '/videos/' + params.videoId + '/related' + getRelatedFields, {
            params: {
              programFilter: params.sameProgram ? 'same' : 'different',
              excludeVideos: $rootScope.WATCHED_VIDEO_IDS ? $rootScope.WATCHED_VIDEO_IDS.join(',') : []
            }
          });
        },

        getPhotos: function(params) {
          params = getCategories(params || {});
          return $http.get(getBase(params) + '/photos' + getPhotosFields, {
            params: {
              limit: params.limit || LimitSrv.get(),
              lastId: params.lastId,
              category: params.category,
              skip: params.skip
            },
            cache: false
          });
        },

        getPreview: function(params) {
          return $http.get(PATHS.API + '/showtmp/' + params.programSlug + '/' + params.preview);
        },

        getGroups: function(params) {
          return $http.get(PATHS.API + '/program-groups/' + params.programGroupSlug + getGroupsFields);
        },

        getListVideos: function(params) {
          return getList(params, 'videos' + getShowListVideosFields);
        },

        getListPhotos: function(params) {
          return getList(params, 'photos' + getShowListPhotosFields);
        },

        getListEpisodes: function(params) {
          return getList(params, 'episodes' + getShowListEpisodesFields);
        },

        getShowLegals: function(params) {
          return $http.get(getBase(params) + getShowLegalFields);
        }
      };
    }
  ]);
