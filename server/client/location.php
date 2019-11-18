<?php

class ClientLocation {

    public $Client;
    function __construct() {
        $this->Client = new DbModel();
    }
    
    /**
     * Get locations
     */
    function getLocations() {
        // set basic data
        $this->render = false;  // to return json to mobile client
        $response = array('status' => 'ERROR', 'message' => 'none');

        $locations = $this->Client->select("SELECT * FROM locations");
        $response['status'] = 'OK';
        $response['message'] = "Successful!";
        $response['locations'] = $locations;

        _json_echo('getLocations', $response);
    }

    function __destruct() {
    }

}
