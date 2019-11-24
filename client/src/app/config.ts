
// set version
export var VERSION = "0.0.1";

// set connection path web host

export var LOCAL_DATA = true;

var rurl = LOCAL_DATA ? 'http://localhost/training/' : 'https://www.abc.com/training/';

export var DEBUG_ENVIRONMENT = false;
export var TEST_ENVIRONMENT = false;
export var ROOT_PATH = '';

if (rurl.indexOf("localhost") > 0) {
	// local mode
	ROOT_PATH = 'http://localhost/training/';
	DEBUG_ENVIRONMENT = true;
} else {
	// server mode
	ROOT_PATH = 'https://www.abc.com/training/';
}

// Auto testing
if (document.URL.indexOf('localhost:4200') > 0)
	TEST_ENVIRONMENT = true;

export var SERVER_PATH = ROOT_PATH + 'server';
export var SYSTEM_IMAGE_PATH = ROOT_PATH + 'images/system/';
export var PRODUCT_IMAGE_PATH = ROOT_PATH + 'images/product/';

export var USER_GUEST = 0;

export var TERM_ACCEPTED = 1;

export var STRIPE_PUBLISHABLE_KEY = '';
