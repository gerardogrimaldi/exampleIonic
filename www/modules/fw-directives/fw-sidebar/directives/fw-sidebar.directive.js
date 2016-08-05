'use strict';

angular
  .module('fw-sidebar')
  .directive('fwSidebar', [function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        fwShow: '=?'
      },
      templateUrl: 'modules/fw-directives/fw-sidebar/views/fw-sidebar.view.html',
      controller: 'fwSidebarController as vm'
    };
  }]);
