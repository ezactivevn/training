<?php

/** Configuration Variables **/

$url_temp = 'http' . (isset($_SERVER['HTTPS']) ? 's' : '') . '://' . "{$_SERVER['HTTP_HOST']}/{$_SERVER['REQUEST_URI']}";

if (strpos($url_temp, 'localhost')) {
	// localhost mode
	define('DEBUG_ENVIRONMENT', true);

	define('PAYPAL_LIVE', false);
	
	define('BRAINTREE_LIVE', false);

	define('MAIL_LIVE', false);

	define('PUSH_LIVE', false);

	define('DB_NAME', 'training');
	define('DB_USER', 'root');
	define('DB_PASSWORD', '');
	define('DB_HOST', 'localhost');

	define('DEFAULT_TIMEZONE', 'Asia/Ho_Chi_Minh');

	define('ADMIN_PATH', 'http://localhost/admin/');
	define('APP_PATH', 'http://localhost/training/');
} else {
	// webhost mode
	define('DEBUG_ENVIRONMENT', false);

	define('PAYPAL_LIVE', true);

	define('BRAINTREE_LIVE', true);

	define('MAIL_LIVE', true);

	define('PUSH_LIVE', true);

	define('DB_NAME', 'training');
	define('DB_USER', 'root');
	define('DB_PASSWORD', '');
	define('DB_HOST', '');

	define('DEFAULT_TIMEZONE', 'Asia/Hong_Kong');

	define('ADMIN_PATH', 'https://www.abc.com/training/admin/');
	define('APP_PATH', 'https://www.abc.com/training/');
}

define('CLUB_NAME', 'SG Basketball');
define('APP_NAME', 'SG Basketball');

define('SMTP_HOST', '');
define('SMTP_PORT', 465);
define('SMTP_USERNAME', '');
define('SMTP_PASSWORD', '');
define('SMTP_SECURE', true);
define('SMTP_UTF8', true);
define('SMTP_FROM_MAIL', 'info@sgbasketball.com');
define('SMTP_FROM_NAME', 'SG Basketball');

define('MAIL_TEST_ACCOUNT', 'ntusoftwareclub@gmail.com');

// Firebase Cloud Message
define('API_ACCESS_KEY', '');
define('SENDER_ID', '');

define('PUSH_TEST_DEVICE', '');

// Stripe
define('STRIPE_SECRET_KEY', '');

define('SERVER_PATH', APP_PATH . 'server/');
define('PAGINATE_LIMIT', '5');
define('SIZE_LIMIT', 10 * 1024 * 1024);

// DEFINE CONSTANTS
define('USER_GUEST', 0);
define('USER_ADMINISTRATOR', 9);
