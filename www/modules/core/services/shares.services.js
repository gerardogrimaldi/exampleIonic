'use strict';

angular
  .module('core')
  .service('SharesSrv', ['$rootScope', '$stateParams', '$window', '$document', '$cordovaSocialSharing', '$state', 'KALTURA',
    function($rootScope, $stateParams, $window, $document, $cordovaSocialSharing, $state, KALTURA) {

      function share(params) {
        $cordovaSocialSharing.share(params.message || null, params.subject || null, params.image || null, 'https://www.fwtv.tv' + (params.url ? '/' + params.url : ''));
      }

      return {
        share: function(params) {
          var title = null,
            description = null,
            image = null,
            url = null,
            show = params.show,
            programSlug = $stateParams.programSlug;

          switch ($state.current.name) {
            case 'show-index':
              title = show.title + ' en FWTV';
              description = show.description;
              image = show.logo;
              url = programSlug;
              break;
            case 'show-blog':
              title = '';
              description = show.description;

              if (show.blog) {
                title += show.blog.title + ' | ';
                if (show.blog.blurb) {
                  description = show.blog.blurb;
                }
              }

              title += 'Blog | ' + show.title + ' en FWTV';
              image = show.blog && show.blog.image ? show.blog.image : show.logo;
              url = programSlug + '/blog';
              break;
            case 'show-blog-post':
              title = '';
              description = show.description;

              if (show.blog) {
                title += show.blog.title + ' | ';
                if (show.blog.blurb) {
                  description = show.blog.blurb;
                }
              }

              title += 'Blog | ' + show.title + ' en FWTV';
              image = show.blog && show.blog.image ? show.blog.image : show.logo;
              url = programSlug + '/blog/' + $stateParams.blogSlug;
              break;
            case 'show-fototeca':
              title = 'Fototeca de ' + show.title + ' en FWTV';
              description = 'Fotos subidas por usuarios de ' + show.title;
              image = show.logo;
              url = programSlug + '/fototeca';
              break;
            case 'show-fototeca-photo':
              title = 'Foto de ' + (params.userPicture && params.userPicture.profile.name) + ' | Fototeca | ' + show.title + ' en FWTV ';
              description = 'Foto subida por ' + (params.userPicture && params.userPicture.profile.name) + ' en ' + show.title;
              image = show.logo;
              url = programSlug + '/fototeca/foto/' + $stateParams.userPictureId;
              break;
            case 'show-videoteca':
              title = (params.category ? '"' + params.category + '"' : 'Videoteca |') + ' de ' + show.title + ' en FWTV';
              description = 'Videoteca de ' + (params.category ? '"' + params.category + '"' + ' de ' + show.title : show.title);
              image = show.logo;
              url = programSlug + '/subituvideo';
              break;
            case 'show-videoteca-player':
              if (show.featured || show.recording || show.episode) {
                title = (show.featured || show.recording || show.episode).title + ' | ' + (show.recordingSectionTitle || 'Videoteca') + ' | ' + show.title + ' en FWTV ';
                description = (show.featured || show.recording || show.episode).description;
              }
              image = show.logo;
              url = programSlug + '/subituvideo/' + $stateParams.recordingSlug + '/' + $stateParams.recordingId;
              break;
            case 'show-episodes':
              title = 'Episodios | ' + show.title + ' en FWTV';
              description = show.description;
              image = show.logo;
              url = programSlug + '/episodios';
              break;
            case 'show-photos':
              title = (params.category ? '"' + params.category + '"' : 'Fotos ') + ' de ' + show.title + ' en FWTV';
              description = 'Fotos de ' + (params.category ? '"' + params.category + '"' + ' de ' + show.title : show.title);
              image = show.logo;
              url = programSlug + '/fotos';
              break;
            case 'show-videos':
              title = (params.category ? '"' + params.category + '"' : 'Videos |') + ' de ' + show.title + ' en FWTV';
              description = 'Videos de ' + (params.category ? '"' + params.category + '"' + ' de ' + show.title : show.title);
              url = programSlug + '/videos';
              break;
            case 'show-player-live':
            case 'show-player':
              image = show.logo;

              if (show.featured) {
                title = show.featured.title + ' | ';
                //videoTitle = show.featured.title;
                description = show.featured.description;
              }

              title += show.title + ' en FWTV';

              if (show.episode) {
                if (show.episode.promoPhoto) {
                  image = show.episode.promoPhoto;
                } else if (show.episode.promoVideo) {
                  image = KALTURA.FULL_PATH + show.episode.promoVideo + '/width/500';
                }
              }

              url = programSlug + '/videos/' + $stateParams.videoSlug;
              break;
          }

          share({
            message: title,
            subject: description,
            image: image,
            url: url
          });
        }
      };
    }
  ]);
