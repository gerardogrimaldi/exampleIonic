'use strict';

angular
  .module('fw-sidebar')
  .controller('fwSidebarController', ['$scope', '$rootScope', '$location', 'ProfileSrv', 'GenresSrv', 'ShowsSrv', 'ListGeneratorsSrv', '$ionicSideMenuDelegate', '$state', '$window', '$filter',
    function($scope, $rootScope, $location, ProfileSrv, GenresSrv, ShowsSrv, ListGeneratorsSrv, $ionicSideMenuDelegate, $state, $window, $filter) {
      var vm = this,
        programs = null;
      vm.DEFAULT_THUMB = $rootScope.DEFAULT_THUMB;
      $scope.IS_IOS = $rootScope.IS_IOS;
      $scope.LOCALE = $rootScope.LOCALE;

      if ($rootScope.IS_MOBILE) {
        vm.windowWidth = $rootScope.IS_IOS ? $window.innerWidth : $window.innerWidth - ($window.innerWidth / 4);
      } else {
        vm.windowWidth = $window.innerWidth / 3;
      }

      $rootScope.$watch('USER', function(user) {
        vm.user = $rootScope.USER;
        setProgramLiked();
      });

      $rootScope.$on('Profile:Likings:ReSet', function() {
        setProgramLiked();
      });

      vm.onClickOpenSidebar = function() {
        setProgramLiked();
        $ionicSideMenuDelegate.toggleLeft();
      };

      function getGenres() {
        GenresSrv.get().then(function(Genres) {
          var items = Genres && Genres.data ? Genres.data : Genres,
            item = null,
            i = 0,
            l = items ? items.length : 0;

          for (i; i < l; i++) {
            item = items[i];
            if (item.isHome || item.slug === 'landing') {
              items.splice(i, 1);
              break;
            }
          }

          vm.genres = items;
        });
      }

      getGenres();

      function getShows() {
        ShowsSrv.get().then(function(Programs) {
          programs = Programs && Programs.data ? Programs.data : Programs;
          if (programs && programs.length) {
            filterBy();
          }
        });
      }

      getShows();

      function getBy(shows, type) {
        var output = [],
          item = null,
          i = 0,
          l = shows ? shows.length : 0;

        if (shows && shows.length) {
          for (i; i < l; i++) {
            item = shows[i];
            if (type === 'program' && (!item.isSeries && !item.isSpecial)) {
              output.push(item);
            } else if (type === 'webseries' && (item.isSeries && !item.isSpecial)) {
              output.push(item);
            } else if (type === 'specials' && (!item.isSeries && item.isSpecial)) {
              output.push(item);
            }
          }
          return output;
        }

        return shows;
      }

      function filterBy() {
        vm.showsList = ListGeneratorsSrv.set(getBy(programs, 'program'), 3, true);
        vm.seriesList = ListGeneratorsSrv.set(getBy(programs, 'webseries'), 3, true);
        vm.specialsList = ListGeneratorsSrv.set(getBy(programs, 'specials'), 3, true);
      }

      function setProgramLiked() {
        var list = [],
          items = ProfileSrv.getCurrentLikings(),
          item = null,
          i = 0,
          l = items ? items.length : 0;

        if (l) {
          for (i; i < l; i++) {
            item = items[i];
            if (item.program && item.program._id) {
              list.push(item.program);
            }
          }
          vm.programsLikedList = ListGeneratorsSrv.set(list, 3, true);
        } else {
          vm.programsLikedList = null;
        }
      }

      setProgramLiked();

      vm.onClickGoToGenre = function(genreSlug) {
        $state.go('main.genre', {
          genreSlug: genreSlug
        });

        vm.currentGenre = genreSlug;

        vm.onClickOpenSidebar();
      };

      vm.onClickGoToHome = function() {
        $rootScope.$emit('App:Header:Reset');
        $state.go('main.home');
        vm.currentGenre = null;
        vm.onClickOpenSidebar();
      };

      vm.onClickGoToShow = function(showSlug) {
        $state.go('show-index', {
          programSlug: showSlug
        });

        vm.onClickOpenSidebar();
      };

      vm.onClickGoToLogin = function() {
        $state.go('main.login');
        vm.onClickOpenSidebar();
      };

      vm.onClickGoToProfile = function() {
        $state.go('main.profile');
        $rootScope.$emit('App:Header:Title', $filter('translate')('fwHeader.profile'));
        vm.onClickOpenSidebar();
      };

      vm.onClickShowGeneres = function() {
        vm.showGenres = vm.showGenres ? false : true;
      };

      function setLanguage(id) {
        $window.localStorage.setItem('FWTV-locale', id);

        switch (id || $window.navigator.language) {
          case 'en':
            id = 'en-us';
            break;
          case 'es':
            id = 'es-ar';
            break;
          default:
            id = id + '-' + id.toLowerCase();
            break;
        }

        $window.localStorage.setItem('NG_TRANSLATE_LANG_KEY', id);

        location.reload();
      }

      vm.onClickSetLanguage = function(id) {
        setLanguage(id);
      };

      vm.onChangeLanguges = function() {
        setLanguage(vm.language);
      };
    }
  ]);
