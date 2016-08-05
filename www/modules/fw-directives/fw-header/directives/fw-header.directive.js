'use strict';

angular
  .module('fw-header')
  .directive('fwHeader', [function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        fwShow: '=',
        title: '='
      },
      templateUrl: 'modules/fw-directives/fw-header/views/fw-header.view.html',
      controller: 'fwHeaderController as vm'
    };
  }])
  .directive('fwSubHeader', [function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        fwShow: '=',
        title: '='
      },
      templateUrl: 'modules/fw-directives/fw-header/views/fw-sub-header.view.html',
      controller: 'fwSubHeaderController as vm'
    };
  }]);
