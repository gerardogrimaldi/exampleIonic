'use strict';

angular
  .module('core')
  .service('ComscoreSrv', ['$location', '$window', 'COMSCORE', '$timeout',
    function($location, $window, COMSCORE, $timeout) {

      function send(name) {
        if ($window.udm_) {
          $window.udm_(COMSCORE.TRIGGER + name);
        } else {
          $timeout(function() {
            send(name);
          }, 50);
        }
      }

      return {
        trigger: function(name) {
          if ($window.FWTV_QA) {
            return false;
          }

          send(name);

          // HARDCODED POR URGENCIA
          if ($location.path() === '/cocine') {
            $window._fbq = $window._fbq || [];
            $window._fbq.push(['track', '6017347156588', {
              'value': '0.00',
              'currency': 'ARS'
            }]);
          }
        }
      };
    }
  ]);
