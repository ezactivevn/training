<?php

header('Access-Control-Allow-Origin: *');

class AdminUser {
	
	public $Admin;
    function __construct() {
        $this->Admin = new DbModel();
    }

	function beforeAction () {

	}

	/**
     * Login
     */
    function login() {

        // set basic data
        $this->render = false;  // to return json to mobile client
        $response = array('status' => 'ERROR', 'message' => 'none');

        // no need to validate      
        $email = $_POST['email'];     
        $email = strtolower($email);
        $password = $_POST['password'];

        $user = $this->Admin->selectOne("SELECT id, role, password FROM users WHERE email = '$email'");

		if ($user == null) {
            $response['message'] = 'Wrong email or password!';
        } else {

            // verify password
            if (password_verify($password, $user['password'])) {
                $session_id = session_id();
                $user['base64'] = base64_encode($user['id'] . '|' . time() . '|' . $session_id);
                $response['status'] = 'OK';
                $response['message'] = "Log in successful!";
                $response['info'] = $user;

                // update session_key and last logon
                $today = date('Y-m-d H:i:s');
                $this->Admin->update("UPDATE users SET last_logon='$today', session_id='$session_id' WHERE id=" . $user['id']);
            } else {
                $response['message'] = 'Wrong email or password!';
            }

        }
        _json_echo('login', $response);
    }

    /**
     * Get info user
     */
    function getInfoUser() {

        // set basic data
        $response = array('status' => 'ERROR', 'message' => 'none');

        // no need to validate      
        $user_id = $_POST['user_id'];
        $ss_id = $_POST['ss_id'];

        // check online user
        $user = $this->Admin->selectOne('SELECT * FROM users WHERE id = ' . $user_id . ' AND session_id = "' . $ss_id . '"');
        if ($user) {
            $response['status'] = "OK";
            $response['info'] = $user;
        } else {
            $response['message'] = "Your session has expired, please login again.";
        }
        
        _json_echo('getInfoUser', $response);
    }

    /**
     * Reset password
     */
    function resetPassword() {

        // set basic data
        $this->render = false;  // to return json to mobile client
        $response = array('status' => 'ERROR', 'message' => 'none');

        $email = $_POST['email'];
        $email = strtolower($email);
            
        $user = $this->Admin->selectOne('SELECT id, role FROM users WHERE email = "'. $email .'"');

        if ($user == null) {
            $response['message'] = 'Wrong email!';
        } else {
            // create a new password
            $new_password = substr(md5(time()), 0, 5);
        
            // set up and send mail
            require_once(FRAMEWORK_ROOT . '/mailer/Mailer.php');
            $subject = CLUB_NAME . ' - New password for '. $email;
            $message = 'You have requested a password reset for your ' . CLUB_NAME . ' account.<br/>Your new password is: '. $new_password;
            $message .= '<br/><br/>Regards,';
            $message .= '<br/>' . CLUB_NAME;

            $mailer = new Mailer();
            $mailer->update(array(
                'from_mail' => SMTP_FROM_MAIL,
                'from_name' => SMTP_FROM_NAME
            ));

            $result = $mailer->send($email, $email, $subject, $message);
            if($result['status'] == 'OK') {
                $this->Admin->update('UPDATE users SET password = "' . password_hash($new_password, PASSWORD_DEFAULT) . '" WHERE email = "'. $email .'"');
                $response['status'] = 'OK';
                $response['message'] = 'An email with new password was sent to email address: '. $email .'. Please check your inbox (including junk/spam folder) and use that password to login.'; 
            } else {
                $response['message'] = $result['message'];
            }
        }
        _json_echo('resetPassword', $response);
    }
    
    /**
     * Change password
     */
    function changePassword() {

        // set basic data
        $response = array('status' => 'ERROR', 'message' => 'none');

        // no need to validate      
        $id = $_POST['id'];
        $old_password = $_POST['old_password'];
        $new_password = $_POST['new_password'];
        $rnew_password = $_POST['rnew_password'];

        $user = $this->Admin->selectOne("SELECT email, role, password FROM users WHERE id = $id");

        if ($user == null) {
            $response['message'] = 'Username is not valid!';
        } else {
            if (password_verify($old_password, $user['password'])) {
                if ($new_password != $rnew_password) {
                    $response['message'] = 'New password does not match retyped password!';
    
                } else {
                    $this->Admin->update('UPDATE users SET password = "' . password_hash($new_password, PASSWORD_DEFAULT) . '" WHERE id = '. $id);
                    $response['status'] = 'OK';
                    $response['message'] = 'Your password has been changed successfully!'; 
                }
            } else {
                $response['message'] = 'Old password is not valid!';
            }
        }
        _json_echo('changePassword', $response);
    }

    function logout() {
        // set basic data
        $response = array('status' => 'ERROR', 'message' => 'none');
        $user_id = $_POST['user_id'];

        // delete onlineuser
        $this->Admin->update("UPDATE users SET session_id='' WHERE id=" . $user_id);

        $response['status'] = 'OK';
        $response['message'] = 'Log out successful!';

       _json_echo('logout', $response);
    }

    function afterAction() {
    
    }
}