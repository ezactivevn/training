// -- system

var pathname = window.location.pathname; 	// Returns path only
var rurl      = window.location.href;     // Returns full URL
console.log ('config.js - pathname, url = ' + pathname + ', ' + rurl);

/**
 * Le Quyet Tien 03/01/2018
 * Check device mobile or pc for change type select attribute in Datatable
 */
console.log(navigator.userAgent);
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	// is mobile
	var SELECT_MODE = 'multi';
} else {
	// is pc
	var SELECT_MODE = 'multi+shift';
}

// Phan Viet Hoang - 16/07/16 - get SERVER_PATH

var PRODUCTION_ENVIRONMENT = false;
var DEVELOPMENT_ENVIRONMENT = false;
var DEBUG_ENVIRONMENT = false;

var ROOT_PATH = '';
if (rurl.indexOf("localhost") > 0) {
	// local mode
	ROOT_PATH = 'http://localhost/training/';
	DEVELOPMENT_ENVIRONMENT = true;
	DEBUG_ENVIRONMENT = true;

} else {
	// Redirect http to https
	if (rurl.indexOf('http://')==0){
	    window.location.href = rurl.replace('http://','https://');
	}
	// server mode
	ROOT_PATH = 'https://www.abc.com/training/';
	PRODUCTION_ENVIRONMENT = true;
}

var	SERVER_PATH = ROOT_PATH + 'server/admin/';
var SYSTEM_IMAGE_PATH = ROOT_PATH + 'images/system/';
var PRODUCT_IMAGE_PATH = ROOT_PATH + 'images/product/';

var USER_GUEST = 0;
var USER_ADMINISTRATOR = 9;

/**
 * DEFINE PERMISSION
 */
var USER_ADMINISTRATOR_PERMISSION = ['dashboardCtrl', 'tablesCtrl', 'mainCtrl', 'logoutCtrl'];
