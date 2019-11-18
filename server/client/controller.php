<?php

header('Access-Control-Allow-Origin: *');

require_once(SERVER_ROOT . DS . 'client' . DS . 'user.php');
require_once(SERVER_ROOT . DS . 'client' . DS . 'location.php');
require_once(SERVER_ROOT . DS . 'client' . DS . 'booking.php');
require_once(SERVER_ROOT . DS . 'client' . DS . 'payment.php');

// ---------------------------------------------------------

class ClientController {

    public $user;
    public $location;

	function beforeAction () {
        if (!isset($this->user)) 
            $this->user = new ClientUser();
        if (!isset($this->location)) 
            $this->location = new ClientLocation();
        if (!isset($this->booking)) 
            $this->booking = new ClientBooking();
        if (!isset($this->payment)) 
            $this->payment = new ClientPayment();
    }
	
	// --- ACTION ---------------------------

	function execute($action) {
		logError ('action = ' . print_r($action, true));

		try {
			switch ($action) {
				case "login":				$this->user->login();					break;
				case "register":			$this->user->register();				break;
				case "resetPassword":		$this->user->resetPassword();			break;
				
				case "getLocations":		$this->location->getLocations();		break;

				case "getBookingsByUser":	$this->booking->getBookingsByUser();	break;
				case "bookNow":				$this->booking->bookNow();				break;

				case "paymentCourtBooking":	$this->payment->paymentCourtBooking();	break;

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

