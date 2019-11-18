<?php

class ClientPayment {

    public $Client;
    function __construct() {
        $this->Client = new DbModel();
    }
    
    /**
     * Payment court booking
     */
    function paymentCourtBooking() {
        // set basic data
        $this->render = false;  // to return json to mobile client
        $response = array('status' => 'ERROR', 'message' => 'none');

        // get data
        $booking_id = $_POST['booking_id'];
        $token = $_POST['token'];

        $status = 'PAID';
        $created_at = date('Y-m-d H:i:s');

        $payment_id = $this->Client->insert("INSERT INTO `payments`(`booking_id`, `token`, `status`, `created_at`) VALUES ($booking_id, '$token', '$status', '$created_at')");

        $response['status'] = 'OK';
        $response['message'] = "Payment Successful!";
        $response['info'] = $payment_id;

        _json_echo('paymentCourtBooking', $response);
    }

    function __destruct() {
    }

}
