<?php

class ClientUser {

    public $Client;
    function __construct() {
        $this->Client = new DbModel();
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

        $user = $this->Client->selectOne("SELECT * FROM users WHERE email = '$email'");

		if ($user == null) {
            $response['message'] = 'Wrong email or password!';
        } else {
            
            // verify password
            if (password_verify($password, $user['password'])) {
                $session_id = session_id();
                $user['base64'] = base64_encode($user['id'] . '|' . time() . '|' . $session_id);
                $response['status'] = 'OK';
                $response['message'] = "Log in successful!";
                $response['user'] = $user;

                // update last logon
                $today = date('Y-m-d H:i:s');
                $this->Client->update("UPDATE users SET last_logon='$today' WHERE id=" . $user['id']);
            } else {
                $response['message'] = 'Wrong email or password!';
            }
            
        }
        _json_echo('login', $response);
    }

    /**
     * Register account
     */
    function register() {

        $response = array('status' => 'ERROR', 'message' => 'none');

        $first_name = $_POST['first_name'];
        $last_name = $_POST['last_name'];
        $mobile = $_POST['mobile'];
		$email = strtolower($_POST['email']);
		$testMode = isset($_POST['test']);
		
        $accept_rules = 1;
        
        $user = $this->Client->selectOne('SELECT id, role FROM users WHERE email = "'. $email .'"');
        if ($user) {
            $response['message'] = 'User already exists! Reset password to use the system';
            _json_echo('register', $response);
            return;
        }

        // create a new password
		$password_md5 = substr(md5(time()), 0, 5);
		$password = password_hash($password_md5, PASSWORD_DEFAULT);
		$role = USER_GUEST;
		$created_at = date('Y-m-d H:i:s');

		$sql = "INSERT INTO users(first_name, last_name, mobile, email, role, password, created_at, accept_rules) VALUES ('$first_name', '$last_name', '$mobile', '$email', '$role', '$password', '$created_at', '$accept_rules')";
		$user_id = $this->Client->insert($sql);

		if ($testMode) {
			$result = true;
		} else {
			// set up and send mail
			require_once(FRAMEWORK_ROOT . '/mailer/Mailer.php');
			$subject = CLUB_NAME . ': New User Account Creation';
			$message = '<p>A new user account has been created to allow you to log into the ' . APP_NAME . ' App.</p>';
			$message .= '<p>Your details are as follows: <br/>';
			$message .= 'Username: ' . $email . '<br/>';
			$message .= 'Password: ' . $password_md5 . '</p>';
			$message .= '<p>Regards,<br/>';
			$message .= CLUB_NAME . '</p>';
			
			$mailer = new Mailer();
			$mailer->update(array(
				'from_mail' => SMTP_FROM_MAIL,
				'from_name' => SMTP_FROM_NAME
			));
			$result = $mailer->send(CLUB_NAME . ' Member', $email, $subject, $message);
		}

        if($result) {
            $response['status'] = 'OK';
			$response['message'] = 'Your user account has been created. An email with password was sent to email address: '. $email .'. Please check your inbox (including junk/spam folder) and use this password to login.';
			// add info for testing
			if ($testMode)
				$response['message'] .= '|' . $password_md5;
        } else {
            $response['message'] = "Your user account has been created. But the system can not send password to the email address. Your password is $password_md5. Please use this password to login!";
        }
        
        _json_echo('register', $response);
    }

    /**
     * Reset password
     */
    function resetPassword() {

        // set basic data
		$response = array('status' => 'ERROR', 'message' => 'none');
		$testMode = isset($_POST['test']);
        $email = strtolower($_POST['email']);
		$email = $email;

		$user = $this->Client->selectOne('SELECT id, role FROM users WHERE email = "'. $email .'"');
        if ($user == null) {
            $response['message'] = 'Email is not in the system!';
        } else {
            // create a new password
			// $new_password = substr(md5(time()), 0, 5);
			$password = substr(md5(time()), 0, 5);
			$password_md5 = $password;
			if ($testMode) {
				$result = true;
			} else {
				// set up and send mail
                require_once(FRAMEWORK_ROOT . '/mailer/Mailer.php');
                $subject = CLUB_NAME . '  - New password for '. $email;
                $message = 'You have requested a password reset for your ' . CLUB_NAME . ' account.<br/>Your new password is: '. $password;
 
                $message .= '<br/>' . CLUB_NAME;
                $mailer = new Mailer();
                $mailer->update(array(
                    'from_mail' => SMTP_FROM_MAIL,
                    'from_name' => SMTP_FROM_NAME
				));
				$result = $mailer->send($email, $email, $subject, $message);
			}
			if($result == true) {
				$password = password_hash($password, PASSWORD_DEFAULT);
				$this->Client->update('UPDATE users SET password = "' . $password . '" WHERE email = "'. $email .'"');
				$response['status'] = 'OK';
				$response['message'] = 'An email with new password was sent to email address: '. $email .'. Please check your inbox and use that password to login.';
				// add info for testing
				if ($testMode)
					$response['message'] .= '|' . $password_md5;
			} else {
				$response['message'] = 'System can not send new password to the email address. Please try again!';
			}
        }
        
        _json_echo('resetPassword', $response);
    }

    function __destruct() {
    }

}
