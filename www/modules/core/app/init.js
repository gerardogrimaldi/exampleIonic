/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */
'use strict';

window.APP_INIT = {
  deviceready: false,

  start: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    var self = this;
    if (document.URL.indexOf('http') === -1) {
      document.addEventListener('deviceready', this.onDeviceReady, false);
      document.addEventListener('handleOpenURL', this.handleOpenURL, false);

      setTimeout(function() {
        self.onDeviceReady();
      }, 3000);
    } else {
      this.onDeviceReady();
    }
  },

  onDeviceReady: function() {
    var self = window.APP_INIT;
    if (!self.deviceready) {
      self.deviceready = true;

      if (navigator && navigator.splashscreen) {
        navigator.splashscreen.hide();
      }

      ionic.Platform.ready(function() {
        ionic.Platform.detect();
        angular.bootstrap(document, [APP.NAME], {
          //strictDi: true //error de injeccion
        });
      });
    }
  },

  handleOpenURL: function(url) {
    if (url && url !== 'fwtv://') {
      this.OPEN_URL = url.substring(url.indexOf('/') + 2).split('/');
    }
  }
};

function handleOpenURL(url) {
  window.APP_INIT.handleOpenURL(url);
}
