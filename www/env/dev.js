/* eslint angular/window-service: 0 */
/* eslint angular/document-service: 0 */

'use strict';

window.FWTV_API = (function() {
  if(window.FWTV_PROD) {
    return window.FWTV_API;
  }

  var host = location.host || location.hostname,
    port = location.port,
    base = 'localhost:3002';

  if(host && (host.indexOf('localhost') !== -1 || port === 3003 || port === 3004)) {
    base = host.split(':')[0] + ':3002';
    window.FWTV_DEV = true;
    base = 'fwtv-api-qa.herokuapp.com';
  } else {
    //base = '10.30.10.138:3002';
    base = 'fwtv-api-qa.herokuapp.com';
  }

  //base = 'fwtv-api-qa.herokuapp.com';
  //base = 'api.fwtv.tv';

  window.FWTV_QA = true;
  window.FWTV_PRODUCTS = true;
  return 'https://' + base;
}());
