/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */

'use strict';

angular
  .module('core')
  .constant('PATHS', {
    API: window.FWTV_API,
    HOME: window.FWTV_API + '/home',
    PROFILE: window.FWTV_API + '/profiles',
    PROFILE_NOTIFICATIONS: window.FWTV_API + '/notifications',
    PROFILE_PRODUCTS_ENABLE: window.FWTV_API + '/payments/profiles/products/enabled',
    LIKING: window.FWTV_API + '/likings',
    COMMENTS: window.FWTV_API + '/comments',
    REPORTS: window.FWTV_API + '/reports',
    SHOW: window.FWTV_API + '/show',
    VISIT: window.FWTV_API + '/visits',
    PROGRAMS: window.FWTV_API + '/programs',
    USER_PICTURES: window.FWTV_API + '/user-pictures',
    PROPOSALS: window.FWTV_API + '/proposals',
    RECORDINGS: window.FWTV_API + '/recordings',
    FEEDBACKS: window.FWTV_API + '/feedbacks',
    GENRES: window.FWTV_API + '/genres',
    PLAY_TIMES: window.FWTV_API + '/play-times',
    DOWNLOADS: window.FWTV_API + '/download-videos',
    PRODUCTS: window.FWTV_API + '/products',
    PAYMENTS: window.FWTV_API + '/payments',
    PAYMENTS_TRIAL: window.FWTV_API + '/payments'
  })
  .constant('AUTH', {
    VENDOR_KEY: !window.FWTV_QA ? '6c6d4dae25d1e1a45e18' : 'abcd',
    VENDOR_SECRET: !window.FWTV_QA ? '2322ed0411410148bec1478d330d562b' : '1234',
    FACEBOOK_ME: 'https://graph.facebook.com/v2.2/me',
    FACEBOOK_CLIENT_KEY: '691967690940098',
    TWITTER_CONSUMER_KEY: 'oEFJQfSWaLKInN2v7PpSQ',
    TWITTER_CONSUMER_SECRET: 'DPDdXUN9btyQ7uTKTbLy7KTmoBCW9ZwSwwSfRrw'
  })
  .constant('KALTURA', {
    BASE: 'https://www.kaltura.com',
    API: 'https://www.kaltura.com/api_v3/index.php',
    CDN: '//cdn.kaltura.com/p/',
    PARTNER_ID: '1164832',
    BASE_PATH: 'https://cdnapisec.kaltura.com',
    FULL_PATH: 'https://d3tcbvasf7fck2.cloudfront.net/p/1164832/thumbnail/entry_id/',
    EMBED_IFRAME: 'https://cdnapisec.kaltura.com/p/1164832/sp/116483200/embedIframeJs/uiconf_id/21165911/partner_id/1164832?iframeembed=true&playerId=kaltura_player_1402091242&entry_id='
  })
  .constant('ALGOLIA', {
    APP_ID: 'BFUPPVYGI0',
    API_KEY: '1281fe88faa993467724d6e1ea2dd5ef'
  })
  .constant('TREASUREDATA', {
    API: 'https://in.treasuredata.com/js/v3/event',
    WRITE_KEY: '6415/1697f53447cede5e997e2d8d7a2f9f9e5a46a8b3'
  })
  .constant('TELIZE', {
    API: 'https://www.telize.com/geoip'
  })
  .constant('COMSCORE', {
    TRIGGER: (document.location.href.charAt(4) === 's' ? 'https://sb' : 'http://b') + '.scorecardresearch.com/b?c1=2&c2=17502533&ns_site=fwtv&name='
  })
  .constant('FAYE', {
    HOST: 'https://fwtv-faye-dev.herokuapp.com/faye'
  })
  .constant('THUMB', {
    DEFAULT: 'modules/core/img/fw-default-thumb.png',
    AVATAR: 'modules/core/img/fw-default-avatar.png'
  })
  .constant('E_PLANNING', {
    API: 'http://ads.e-planning.net/mob?id=353e8d989b4e14ec&format=json'
  })
  .constant('AWS3', {
    ACCESS_KEY_ID: 'AKIAIYBR7OBAQ2CHJGSQ',
    SECRET_ACCESS_KEY: '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',
    BUCKET: 'fwtv-recordings',
    REGION: 'sa-east-1'
  });
