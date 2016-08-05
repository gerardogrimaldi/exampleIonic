'use strict';

angular
  .module('core')
  .service('DownloadsSrv', ['$http', 'PATHS', '$cordovaFileTransfer', '$ionicPopup', '$cordovaFile', '$cordovaNetwork',
    function ($http, PATHS, $cordovaFileTransfer, $ionicPopup, $cordovaFile, $cordovaNetwork) {
      var freeSpace = 0,
        flavors = null,
        currentByteSize = 0;

      function bytesToSize(bytes) {
        if (bytes === 0) {
          return 'n/a';
        }
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
        return Math.round(bytes / Math.pow(1024, i), 2);
      }

      function getFlavor(cb) {
        var hdFlavor = null,
          sdFlavor = null,
          items = [],
          item = null,
          i = 0,
          l = flavors && flavors.length ? flavors.length : 0,
          width = null;

        for (i; i < l; i++) {
          item = flavors[i];
          if (item.flavorAsset && item.flavorAsset.tags.indexOf('mobile') !== -1 && item.flavorAsset.size < freeSpace) {
            items.push(item);
          }
        }

        i = 0;
        l = items && items.length ? items.length : 0;
        items = items.sort(function (a, b) {
          return a.flavorAsset.width > b.flavorAsset.width ? -1 : 1;
        });

        for (i; i < l; i++) {
          item = items[i];
          width = item.flavorAsset.width;
          if (width === 320 && !sdFlavor) {
            sdFlavor = item;
          } else if (width === 640 && !sdFlavor) {
            sdFlavor = item;
          } else if (width === 720 && !hdFlavor) {
            hdFlavor = item;
          } else if (width === 1280 && !hdFlavor) {
            hdFlavor = item;
          } else if (width === 1080 && !hdFlavor) {
            hdFlavor = item;
          }
        }

        if (hdFlavor && sdFlavor) {
          var $pop = $ionicPopup.show({
            template: '',
            title: 'Calidad',
            subTitle: 'Este video se encuentra en dos versiones',
            buttons: [{
              text: 'Cancelar',
              type: 'button-default',
              onTap: function (e) {
                $pop.close();
              }
            }, {
              text: 'SD (' + bytesToSize(sdFlavor.flavorAsset.size) + 'Mb)',
              type: 'button-default',
              onTap: function (sd) {
                currentByteSize = bytesToSize(sdFlavor.flavorAsset.id);
                cb('/flavor/' + sdFlavor.flavorAsset.id);
                $pop.close();
              }
            }, {
              text: 'HD (' + bytesToSize(hdFlavor.flavorAsset.size) + 'Mb)',
              type: 'button-default',
              onTap: function (hd) {
                currentByteSize = bytesToSize(hdFlavor.flavorAsset.size);
                cb('/flavor/' + hdFlavor.flavorAsset.id);
                $pop.close();
              }
            }]
          });
        } else if (hdFlavor && !sdFlavor) {
          currentByteSize = bytesToSize(hdFlavor.flavorAsset.size);
          cb('/flavor/' + hdFlavor.flavorAsset.id);
        } else if (!hdFlavor && sdFlavor) {
          currentByteSize = bytesToSize(sdFlavor.flavorAsset.size);
          cb('/flavor/' + sdFlavor.flavorAsset.id);
        } else {
          cb('');
        }

        return '';
      }

      function checkNetwork(cb) {
        if ($cordovaNetwork.getNetwork() !== 'wifi') {
          $ionicPopup.confirm({
            title: 'No estas conectado a una red WIFI',
            template: 'Seguro que queres descargar un video mediante el uso de datos?'
          }).then(function (res) {
            if (res) {
              cb();
            }
          });
        } else {
          cb();
        }
      }

      function checkFreeSpace(entryId, cb) {
        $cordovaFile.getFreeDiskSpace().then(function (value) {
          freeSpace = value;

          $http.get('http://www.kaltura.com/api_v3/?service=flavorasset&action=getflavorassetswithparams&format=1', {
            params: {
              entryId: entryId
            }
          }).then(function (items) {
            flavors = items && items.data ? items.data : items;
            cb();
          }, function (err) {
            console.log('checkFreeSpace', err);
          });
        });
      }

      function downloadVideo(params) {
        getFlavor(function (flavor) {
          var url = 'https://cdnsecakmi.kaltura.com/p/1164832/sp/116483200/download/entry_id/' + params.entryId + flavor;
          return $cordovaFileTransfer.download(url, cordova.file.dataDirectory + params.entryId + '.mp4', {}, true)
            .then(function (result) {
              if (params.success) {
                result.size = currentByteSize;
                params.success(result);
              }
            }, params.error || function () {}, params.progress || function () {});
        });
      }

      return {
        video: function (params) {
          checkNetwork(function () {
            checkFreeSpace(params.entryId, function () {
              downloadVideo(params);
            });
          });
        }
      };
    }
  ]);
