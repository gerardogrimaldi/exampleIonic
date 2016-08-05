'use strict';

angular
  .module('fw-header')
  .controller('fwHeaderController', ['$scope', '$element', '$rootScope', 'SearchSrv', 'ShowsSrv', '$ionicSideMenuDelegate', '$state',
    function($scope, $element, $rootScope, SearchSrv, ShowsSrv, $ionicSideMenuDelegate, $state) {
      var vm = this,
        programs = null;
      vm.sectionTitle = null;
      $scope.IS_IOS = $rootScope.IS_IOS;

      function getShows() {
        ShowsSrv.get().then(function(Programs) {
          programs = Programs && Programs.data ? Programs.data : Programs;
        });
      }

      getShows();

      $rootScope.$watch('USER', function() {
        vm.user = $rootScope.USER;
        if (vm.user) {
          vm.hideAnonymusPopover = true;
        }
      });

      $rootScope.$on('App:Header:Title', function(e, title) {
        if (title) {
          vm.sectionTitle = title;
        }
      });

      $rootScope.$on('App:Header:Reset', function() {
        vm.sectionTitle = null;
      });

      $rootScope.$on('App:Header:Notifications:Reset', function() {
        if (vm.user) {
          vm.user.pendingNotifications = false;
        }
      });

      vm.onClickOpenSidebar = function() {
        $rootScope.$broadcast('Profile:Likings:ReSet');
        $rootScope.$emit('App:Header:Reset');
        $ionicSideMenuDelegate.toggleLeft();
      };

      vm.onClickShowSearchBar = function() {
        vm.showSearchBar = vm.showSearchBar ? false : true;
      };

      vm.onChangeSearch = function() {
        var results = [];
        if (vm.search && vm.search.length) {
          results = programs.filter(function(item) {
            if (item.title.toLowerCase().indexOf(vm.search.toLowerCase()) !== -1) {
              return true;
            }
          });
        }
        vm.results = results.slice(0, 5);
      };

      vm.onClickResult = function(item) {
        $state.go('main.search', {
          query: item.title
        });

        vm.results = [];
      };

      vm.onClickNotification = function() {
        $state.go('main.notificacions');
      };

      vm.onSubmitSearch = function() {
        vm.onClickResult({
          title: vm.search
        });
      };
    }
  ])
  .controller('fwSubHeaderController', ['$scope', '$element', '$rootScope', '$state', '$cordovaSocialSharing', '$ionicViewSwitcher', 'SharesSrv',
    function($scope, $element, $rootScope, $state, $cordovaSocialSharing, $ionicViewSwitcher, SharesSrv) {
      var vm = this;
      $scope.IS_IOS = $rootScope.IS_IOS;

      $scope.$$listeners['$stateChangeSuccess'] = null;
      $scope.$on('$stateChangeSuccess', function(e, toState) {
        if (toState.name === 'show-index') {
          setAndroidStyles();
        }
      });

      $scope.$$listeners['App:Header:Android:Style'] = null;
      /*$scope.$on('App:Header:Android:Style', function() {
        setAndroidStyles();
      });*/

      $scope.$$listeners['App:Header:Android:Bg'] = null;
      $scope.$on('App:Header:Android:Bg', function(e, show) {
        if (show) {
          $element[0].classList.add('android-bg-header');
        } else {
          $element[0].classList.remove('android-bg-header');
        }
      });

      function setAndroidStyles() {
        if (!$rootScope.IS_IOS) {
          document.querySelector('body').classList.add('android-style-header');
        } else {
          document.querySelector('body').classList.remove('android-style-header');
        }
      }

      vm.onClickGoBack = function() {
        $rootScope.$broadcast('Profile:Likings:ReSet');
        $ionicViewSwitcher.nextDirection('back');
        if ($state.current.name === 'show-index') {
          $state.go('main.home');
        } else if ($state.current.name === 'comments-blog') {
          $state.go('show-blog-post', {
            programSlug: $state.params.programSlug,
            blogSlug: $state.params.blogSlug
          });
        } else if ($state.current.name === 'comments-show') {
          $state.go('show-index', {
            programSlug: $state.params.programSlug
          });
        } else if ($state.current.name === 'comments-recording') {
          $state.go('show-videoteca-player', {
            programSlug: $state.params.programSlug,
            recordingSlug: $state.params.recordingSlug,
            recordingId: $state.params.recordingId
          });
        } else if ($state.current.name === 'comments-player') {
          $state.go('show-player', {
            programSlug: $state.params.programSlug,
            videoSlug: $state.params.videoSlug
          });
        } else if ($state.current.name === 'show-blog-post') {
          $state.go('show-blog', {
            programSlug: $state.params.programSlug
          });
        } else if ($state.current.name === 'show-videoteca-player') {
          $state.go('show-videoteca', {
            programSlug: $state.params.programSlug
          });
        } else if ($state.current.name === 'show-fototeca-photo') {
          $state.go('show-fototeca', {
            programSlug: $state.params.programSlug
          });
        } else {
          $state.go('show-index', {
            programSlug: $state.params.programSlug
          });
        }
      };

      vm.onClickShare = function() {
        SharesSrv.share({
          show: $scope.fwShow
        });
      };
    }
  ]);
