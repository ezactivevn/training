<?php

class ClientBooking {

    public $Client;
    function __construct() {
        $this->Client = new DbModel();
    }

    /**
     * Get booking by user
     */
    function getBookingsByUser() {
        // set basic data
        $this->render = false;  // to return json to mobile client
        $response = array('status' => 'ERROR', 'message' => 'none');

        // $user_id = $_POST['user_id'];
        $user_id = 1;

        $bookings = $this->Client->join("SELECT * FROM bookings JOIN users ON bookings.user_id = users.id JOIN locations ON bookings.location_id = locations.id JOIN payments ON payments.booking_id = bookings.id WHERE user_id=$user_id");
        $response['status'] = 'OK';
        $response['message'] = "Successful!";
        $response['bookings'] = $bookings;

        _json_echo('getBookingsByUser', $response);
    }
    
    /**
     * Court booking
     */
    function bookNow() {
        // set basic data
        $this->render = false;  // to return json to mobile client
        $response = array('status' => 'ERROR', 'message' => 'none');

        // get data
        $location_id = $_POST['location'];
        $court_type = $_POST['court_type'];
        $date = $_POST['date'];
        $start_time = $_POST['start_time'];
        $end_time = $_POST['end_time'];

        // update start time for date
        // $time = date('H:i:s', strtotime($start_time) );
        $date = date('Y-m-d', strtotime(substr($date, 0, 10)));

        $created_at = date('Y-m-d H:i:s');

        $booking_id = $this->Client->insert("INSERT INTO `bookings`(`user_id`, `location_id`, `court_type`, `date`, `start_time`, `end_time`, `created_at`) VALUES (1, $location_id, '$court_type', '$date', '$start_time', '$end_time', '$created_at')");

        $response['status'] = 'OK';
        $response['message'] = "Successful!";
        $response['info'] = $booking_id;

        _json_echo('bookNow', $response);
    }

    function __destruct() {
    }

}
