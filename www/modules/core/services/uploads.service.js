'use strict';

angular
  .module('core')
  .service('UploadsSrv', ['$http', 'AuthSrv', 'PATHS', '$cordovaFileTransfer', '$cordovaFile', 'AWS3', '$cordovaToast', '$window',
    function ($http, AuthSrv, PATHS, $cordovaFileTransfer, $cordovaFile, AWS3, $cordovaToast, $window) {
      function getHeader(programId) {
        var headers = AuthSrv.getSignature();
        headers.Connection = 'close';
        headers['Content-Type'] = undefined;
        headers.programId = programId;

        return headers;
      }

      return {
        image: function (params) {
          var file = params.file;

          return $cordovaFileTransfer.upload(PATHS.USER_PICTURES, file.localURL, {
            params: {
              programId: params.programId
            },
            fileKey: 'file',
            fileName: file.fullPath.split('/').pop(),
            mimeType: file.type,
            chunkedMode: false,
            headers: getHeader(params.programId)
          }, true);
        },

        imageFromURI: function (params) {
          var fileURI = params.fileURI;

          return $cordovaFileTransfer.upload(PATHS.USER_PICTURES, fileURI, {
            params: {
              programId: params.programId
            },
            fileKey: 'file',
            fileName: fileURI.split('/').pop(),
            mimeType: 'image/png',
            chunkedMode: false,
            headers: getHeader(params.programId)
          }, true);
        },

        userImage: function (params) {
          var fd = new FormData(),
            headers = AuthSrv.getSignature();
          headers['Content-Type'] = undefined;
          fd.append('file', params.file);
          fd.append('output', true);

          return $http.post(PATHS.USER_PICTURES + '/upload/file', fd, {
            transformRequest: angular.identity,
            headers: headers
          });
        },

        record: function (params) {
          var file = params.file,
            reader = new FileReader();

          reader.onloadend = function (evt) {
            $cordovaToast.show('Subiendo Video...', 'short', 'center');

            var Bucket = new AWS.S3({
              region: AWS3.REGION,
              accessKeyId: AWS3.ACCESS_KEY_ID,
              secretAccessKey: AWS3.SECRET_ACCESS_KEY,
              httpOptions: {
                timeout: 7200000 // 2hs
              },
              params: {
                Bucket: AWS3.BUCKET
              }
            }).upload({
              Key: new Date().getTime() + '-' + file.fullPath.split('/').pop(),
              ContentType: file.type,
              ContentEncoding: 'base64',
              Body: evt.target._result
            });

            Bucket.on('httpUploadProgress', params.onprogress || function (e) {
              console.log(Math.round(e.loaded / e.total * 100));
            });

            Bucket.send(function (err, data) {
              console.log('uploadToAWS3', err, data);
              if (!err && params.onload) {
                params.onload(data);
              } else if (params.onerror) {
                params.onerror(err);
              }
            });
          };

          $window.resolveLocalFileSystemURL(file.localURL || file.fullPath, function (fileEntry) {
            fileEntry.file(function (f) {
              reader.readAsArrayBuffer(f);
            });
          }, function (err) {
            console.log('err', err);
          });
        },

        /**
         * Nahuel:
         * no funciona ¬¬, tira access denied,
         * volver a probar cuando se mergee con la ultima version de cordova file que soluciona las rutas desde fileURI.
         **/
        recordFromURI: function (params) {
          var fileURI = params.fileURI;

          console.log(fileURI);

          $window.resolveLocalFileSystemURL(fileURI, function (fileEntry) {
            console.log('fileEntry', fileEntry);
          }, function (err) {
            console.log('err', err);
          });
        }
      };
    }
  ]);
