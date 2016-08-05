/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */

'use strict';

window.FWTV_API = (function() {
  var base = 'api.fwtv.tv';
  //base = '10.30.10.138:3002';
  //base = 'fwtv-api-qa.herokuapp.com';

  window.FWTV_PROD = true;
  window.FWTV_PRODUCTS = false;
  //localStorage.clear(); //Removido de prod no se para que lo habia puesto Naue
  return 'https://' + base;
}());
