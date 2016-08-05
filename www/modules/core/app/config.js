/* eslint angular/window-service: 0 */
'use strict';

window.APP = (function() {
  var NAME = 'FWTV-APP';

  return {
    NAME: NAME,
    DEPENDENCIES: [
      'ionic',
      /*'ngCordova',*/
      /*     'ngCordovaOauth',
       'algoliasearch',
       'angularLazyImg',
       'angular-carousel',
       'angular-cache',
       'ngTouch',
       'pascalprecht.translate',
       'offline'*/
    ],
    ADD_MODULE: function(moduleName, dependencies) {
      angular.module(moduleName, dependencies || []);
      angular.module(NAME).requires.push(moduleName);
    }
  };
}());

angular.module(APP.NAME, APP.DEPENDENCIES);
