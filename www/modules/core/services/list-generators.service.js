'use strict';

angular
  .module('core')
  .service('ListGeneratorsSrv', ['$rootScope',
    function($rootScope) {
      var isForce = false;

      function Split(arr, n) {
        var res = [];
        while (arr ? arr.length : 0) {
          res.push(arr.splice(0, n));
        }
        return res;
      }

      function calculateRowCardAmount(amount) {
        var $rs = $rootScope;
        $rs.IS_PORTRAIT = true;
        amount = amount || 6;

        if (!isForce) {
          if ($rs.IS_MOBILE) {
            amount = $rs.IS_PORTRAIT ? 2 : 3;
          } else if ($rs.IS_TABLET) {
            amount = $rs.IS_PORTRAIT ? 3 : 4;
          }
        }

        return amount;
      }

      function calculateFlexSize(items, amount) {
        amount = amount || calculateRowCardAmount(amount);
        var lastCollection = items[items.length - 1],
          item = null,
          i = 0,
          l = lastCollection ? amount - lastCollection.length : 0;

        if (items[1] && items[0].length !== lastCollection.length || (!items[1] && items[0] && items[0].length - 1 < amount)) {

          item = lastCollection[0];
          if (item) {
            if (item.link) {
              item = {
                extraThumbParameters: item.extraThumbParameters,
                link: item.link
              };
            } else if (item.logo) {
              item = {
                logo: item.logo
              };
            } else if (item.thumb) {
              item = {
                thumb: item.thumb
              };
            }

            for (i; i < l; i++) {
              lastCollection.push(angular.extend({
                _id: i,
                hiddenCard: 'hidden-card'
              }, item));
            }
          }
        }

        return items;
      }

      return {
        set: function(items, amount, force) {
          isForce = force;
          return calculateFlexSize(new Split([].concat(items), calculateRowCardAmount(amount)), amount);
        },
        getItemsPerRow: function() {
          return calculateRowCardAmount();
        }
      };
    }
  ]);
