<?php

header('Access-Control-Allow-Origin: *');

require_once(SERVER_ROOT . DS . 'admin' . DS . 'user.php');

// ---------------------------------------------------------

class AdminController {

    public $user;
    public $onlineUser;

	function beforeAction () {
        if (!isset($this->user)) 
            $this->user = new AdminUser();
    }
	
	// --- ACTION ---------------------------

	function execute($action) {
		logError ('action = ' . print_r($action, true));

		try {
			switch ($action) {
				case "login":				$this->user->login();					break;
				case "logout":				$this->user->logout();					break;
				case "getInfoUser":			$this->user->getInfoUser();				break;
				case "resetPassword":		$this->user->resetPassword();			break;
				case "changePassword":		$this->user->changePassword();			break;
				case "getUsers":			$this->user->getUsers();				break;
				case "setUsers":			$this->user->setUsers();				break;
				case "setPassword":			$this->user->setPassword();				break;
				
				default:
					error_log ('Action not valid = ' . print_r($action, true));
			}
			
		} catch(DbException $e) {
			error_log($e->errorMessage()); 
		}
    }

    function afterAction() {
	
	}
}

