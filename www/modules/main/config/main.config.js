angular
  .module('main')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('main', {
          abstract: true,
          templateUrl: 'modules/main/views/main.view.html',
          controller: 'MainController as vm'
        });
    }
  ]);
