<?php

require FRAMEWORK_ROOT . '/vendor/autoload.php';

$db = new DataTables\Database( array(
	"type" => "Mysql",  		// Database type: "Mysql", "Postgres", "Sqlserver", "Sqlite" or "Oracle"
	"user" => DB_USER,       	// Database user name
	"pass" => DB_PASSWORD,      // Database password
	"host" => DB_HOST,       	// Database host
	"port" => "",       		// Database connection port (can be left empty for default)
	"db"   => DB_NAME,       	// Database name
	"dsn"  => "charset=utf8",	// PHP DSN extra information. Set as `charset=utf8` if you are using MySQL
	"pdoAttr" => array() 		// PHP PDO attributes array. See the PHP documentation for all options
) );
