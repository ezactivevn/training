<?php	

define('EOL', PHP_EOL);
define('DS', DIRECTORY_SEPARATOR);
define('SERVER_ROOT', dirname(__DIR__));
define('APP_ROOT', dirname(SERVER_ROOT));
define('SYSTEM_ROOT', dirname(APP_ROOT));

define('FRAMEWORK_ROOT', SYSTEM_ROOT . DS . 'framework');
define('FRAMEWORK_SERVER_ROOT', FRAMEWORK_ROOT . DS . 'server');

define('SYSTEM_IMAGE_PATH', APP_ROOT . DS . 'images' . DS . 'system' . DS);
define('PRODUCT_IMAGE_PATH', APP_ROOT . DS . 'images' . DS . 'product' . DS);
define('ERROR_LOG_FILE', APP_ROOT . DS . 'server' . DS . 'error.log');

// This id global url
// $url = isset($_GET['url']) ? $_GET['url'] : null;
// error_log ('url = ' . print_r($url, true));

require_once (__DIR__ . DS . 'config.php');
require_once (__DIR__ . DS . 'utility.php');
require_once (SERVER_ROOT . DS . 'admin' . DS . 'controller.php');
require_once (SERVER_ROOT . DS . 'client' . DS . 'controller.php');
require_once (FRAMEWORK_SERVER_ROOT . DS . 'dbmodel.php');
require_once (FRAMEWORK_SERVER_ROOT . DS . 'bootstrap.php');

