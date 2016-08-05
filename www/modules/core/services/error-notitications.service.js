'use strict';

angular
  .module('core')
  .service('ErrorNotificationsSrv', ['$cordovaToast', '$window',
    function($cordovaToast, $window) {
      var messages = [];
      messages['default'] = 'Error procesando datos';
      messages['default:upload'] = 'Error subiendo archivo';
      messages['system:connection-lost'] = 'Conexión perdida!, esperando reconexion...';
      messages['system:connection-reestablished'] = 'Conexión restablecida';
      messages['comment:default'] = 'No se pudo guardar el comentario';
      messages['comment:too-similar-last'] = 'Tu comentario ha sido detectado como posible spam';
      messages['comment:missing-entity'] = 'Faltó enviar una entidad objetivo para el comentario';
      messages['comments:get:error'] = 'No se pudieron traer comentarios, intentá mas tarde';
      messages['liking:default'] = 'Error haciendo "me gusta"';
      messages['liking:default:remove'] = 'Error quitando "me gusta"';
      messages['liking:already-liked'] = 'Ya te gusta esto';
      messages['liking:missing-entity'] = 'Faltó enviar una entidad para gustar';
      messages['liking:already-deleted'] = 'Ya te dejó de gustar esto';
      messages['profile:banned'] = 'Su usuario ha sido bloqueado';
      messages['recording:default'] = 'Error guardando vídeo';
      messages['user-picture:default:vote'] = 'Error votando';
      messages['user-picture:user-already-uploaded'] = 'Ya subiste una foto a este concurso';
      messages['user-picture:missing-contest'] = 'Faltó enviar los datos personales para el concurso';
      messages['user-picture:no-program'] = 'Programa no válido';
      messages['user-picture:error-uploading-image'] = 'Error subiendo imagen';
      messages['user-picture:already-voted'] = 'Ya votaste esta foto';
      messages['user-picture:user-is-creator'] = 'No puedes votar tu propia foto';
      messages['user-picture:no-picture'] = 'Foto de usuario no válida';
      messages['user-picture:upload:success'] = 'Foto subida correctamente';
      messages['user-picture:upload:error'] = 'No se pudo subir la foto, intentá de nuevo';
      messages['user-picture:uploadUri:error'] = 'No se pudo subir la foto, intentá de nuevo';
      messages['user-picture:uploadFile:error'] = 'No se pudo subir la foto, intentá de nuevo';
      messages['user-picture:getImage:error'] = 'No se pudo subir la foto, intentá desde la galeria';
      messages['user-picture:captureImage:error'] = 'No se pudo subir la foto, intentá desde la galeria';
      messages['login:facebook:1'] = 'No se pudo ingresar con Facebook, intentá con Twitter';
      messages['login:facebook:2'] = 'No se pudo ingresar con Facebook, intentá con Twitter';
      messages['login:facebook:3'] = 'No se pudo ingresar con Facebook, intentá con Twitter';
      messages['login:twitter:1'] = 'No se pudo ingresar con Twitter, intentá con Facebook';
      messages['login:twitter:2'] = 'No se pudo ingresar con Twitter, intentá con Facebook';
      messages['login:error'] = 'No se pudo ingresar, intentá mas tarde';

      return {
        show: function(messageId, msg) {
          if ($window.cordova) {
            $cordovaToast.show(messages[messageId], 'short', 'bottom');
          } else {
            console.log(messageId, msg ? msg : '');
          }
        }
      };
    }
  ]);
