<?php
header('Access-Control-Allow-Origin: *');

class Utility {

	public static function sendBulkMailToParents($sender_email, $sender_name, $parents, $cc_src, $bcc_src, $subject_src, $content_src, $files_attached_src, $check_volunteer = false, $include_type = RECIPIENT_BCC) {
        
        // set up mail
        require_once(FRAMEWORK_ROOT . '/mailer/Mailer.php');
        $params = array(
            'from_mail' => $sender_email,
            'from_name' => $sender_name
        );

        $ccs = array();
        $bccs = array();

        // add sender_email to cc
        $ccs[] = $sender_email;
        if (strlen(trim($cc_src)) > 0) {
            $cc = explode(';', trim($cc_src));
            for($i = 0; $i < count($cc); $i++)
                $ccs[] = trim($cc[$i]);
        }
        // add sender_email to bcc
        if (strlen(trim($bcc_src)) > 0) {
            $bcc = explode(';', trim($bcc_src));
            for($i = 0; $i < count($bcc); $i++)
                $bccs[] = trim($bcc[$i]);
        }

        // add parent email
        foreach($parents as $parent) {
            // send mail for coach by volunteer
            if ($check_volunteer) {
                if ($parent['volunteer'] == 2) {
                    // check type cc or bcc
                    if ($include_type == RECIPIENT_CC) {
                        $ccs[] = $parent['email2'];
                    } else {
                        $bccs[] = $parent['email2'];
                    }
                    
                } else {
                    // check type cc or bcc
                    if ($include_type == RECIPIENT_CC) {
                        $ccs[] = $parent['email1'];
                    } else {
                        $bccs[] = $parent['email1'];
                    }
                }
            // send mail for parent (email1, email2 if existing)
            } else {
                $bccs[] = $parent['email1'];
                if ($parent['email2'] != '') {
                    $bccs[] = $parent['email2'];
                };
                if (isset($parent['player_email'])) {
                    $bccs[] = $parent['player_email'];
                }
            }
        }

        $params['cc'] = $ccs;
        $params['bcc'] = $bccs;
        
        // $subject = Utility::resolveEmailFormat($subject_src, $parent);
        // $content = Utility::resolveEmailFormat($content_src, $parent);
        $subject = $subject_src;
        $content = $content_src;

        // add sender_email to cc

        // att params attachments
        if (count($files_attached_src) > 0)
            $params['attachments'] = $files_attached_src;
        
        // Send email to recipient
        $mailer = new Mailer();
        $mailer->update($params);

        $result = $mailer->sendBulk($subject, $content);
        if($result['status'] == 'OK') {
            $type = 'Mail';
            $template_id = 1;
            $today = date('Y-m-d H:i:s');

            $array_parents_id = array();
            foreach($parents as $parent) {
                array_push($array_parents_id, $parent['id']);
            }
            $string_parents_id = implode('|', $array_parents_id);
            // add message to 'communications'
            $subject = mysqli_real_escape_string(mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME), $subject);
            $content = mysqli_real_escape_string(mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME), $content);
            // $query = "INSERT INTO communications (parent_id, template_id, type, sent_date, title, content) VALUES ('" . $string_parents_id . "'," . $template_id . ",'" . $type . "', '" . $today . "', '" . $subject . "','" . $content . "')";
            // $result = performAction('parens', 'queryWithStatus', array($query));

            // Send email to sender
            $mailer = new Mailer();
            unset($params['cc']);
            unset($params['bcc']);
            $mailer->update($params);

            $cc_string = implode('; ', $ccs);
            $bcc_string = implode('; ', $bccs);
            $subject = $subject_src;
            $content = 'CC: ' . $cc_string . '<br/>BCC: ' . $bcc_string . '<br/><hr/><br/>' . $content_src;

            $result2 = $mailer->send($sender_name, $sender_email, $subject, $content);

        }
        return $result;
    }

    public static function verifyEmailData($cc, $bcc, $subject = '', $content = '') {
        $fieldErrors = array();
        // verify cc and bcc
        if (strlen(trim($cc)) > 0) {
            $cc = explode(';', $cc);
            for($i = 0; $i < count($cc); $i++) {
                // must be a real email
                if(filter_var(trim($cc[$i]), FILTER_VALIDATE_EMAIL) === FALSE)
                    $fieldErrors[] = array("name" => "cc", "status" => "Data in <strong>Cc</strong> is not correct! Must be email addresses separated by ;");
            }
        }

        if (strlen(trim($bcc)) > 0) {
            $bcc = explode(';', $bcc);
            for($i = 0; $i < count($bcc); $i++) {
                // search for @
                if(filter_var(trim($bcc[$i]), FILTER_VALIDATE_EMAIL) === FALSE)
                    $fieldErrors[] = array("name" => "bcc", "status" => "Data in <strong>Bcc</strong> is not correct! Must be email addresses separated by ;");
            }
        }
        // verify subject and content
        if ($subject == '') {
            $fieldErrors[] = array("name" => "subject", "status" => "This field is required");
        }

        if ($content == '') {
            $fieldErrors[] = array("name" => "content", "status" => "This field is required");
        }
        return $fieldErrors;
    }

    // http://www.media-division.com/correct-name-capitalization-in-php/
    // public static function titleCase($string) {
    
    public static function getProperName($string) {

        $string = trim($string);
        if (strlen($string) == 0)
            return '';

        // trim and remove extra blank
        $string = str_replace("  "," ", $string);

        $word_splitters = array(' ', '-', "O'", "L'", "D'", 'St.', 'Mc');
        $lowercase_exceptions = array('the', 'van', 'den', 'von', 'und', 'der', 'de', 'da', 'of', 'and', "l'", "d'");
        $uppercase_exceptions = array('III', 'IV', 'VI', 'VII', 'VIII', 'IX');
 
        $string = strtolower($string);
        foreach ($word_splitters as $delimiter) 
        { 
            $words = explode($delimiter, $string); 
            $newwords = array(); 
            foreach ($words as $word)
            { 
                if (in_array(strtoupper($word), $uppercase_exceptions))
                    $word = strtoupper($word);
                else
                if (!in_array($word, $lowercase_exceptions))
                    $word = ucfirst($word); 
 
                $newwords[] = $word;
            }
 
            if (in_array(strtolower($delimiter), $lowercase_exceptions))
                $delimiter = strtolower($delimiter);
 
            $string = join($delimiter, $newwords); 
        } 
        return $string; 
    }
    
    public static function getProperEmail($email) {

        $email = trim($email);
        if (strlen($email) == 0)
            return '';

        // trim and set to lower
        $email = strtolower($email);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            logError("email not valid: " . $email);
            $email = '';
        }
        return $email;
    }

    public static function getProperPhone($phone) {

        // trim and check max 8 digits, Hong Kong
        $phone = trim($phone);
        if (strlen($phone) == 0)
            return '';
        // remove - and space
        $phone = str_replace("-","", $phone);
        $phone = str_replace(" ","", $phone);

        // 1st digit can not be 0, max 10 digits
        // if (preg_match('/^[1-9][0-9]{0,10}$/', $phone))
        // 1st digit can be 0, max 15 digits
        if (preg_match('/^[0-9][0-9]{0,15}$/', $phone))
            return $phone;
        logError("phone not valid: " . $phone);
        return '';
    }

    /**
     * Send push notification with FCM
     * @author  Le Quyet Tien
     * @date   2018-04-06
     * @param  [string]     $token    [token in users table]
     * @param  [string]     $title              [description]
     * @param  [string]     $message            [description]
     * @param  [string]     $user_id            [description]
     */
    static function sendPushFCM($sender_id, $token, $title, $message, $user_id=0, $match_player_id=0, $attachments="") {
        if (PUSH_LIVE == false) {
            logError('push test mode');
            $token = PUSH_TEST_DEVICE;
        }

        // save notification
        // $title = mysqli_real_escape_string(mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME), $title);
        // $message = mysqli_real_escape_string(mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME), $message);
        
        $today = date('Y-m-d H:i:s');
        $query = "INSERT INTO notifications (`sender_id`, `title`, `content`, `attachments`, `user_id`, `match_player_id`, `date`, `status`) VALUES ($sender_id, '$title', '$message', '$attachments', $user_id, $match_player_id, '$today', 0)";
        // logError($query);

        // fix error autoload class Notification
        if (!class_exists("NotificationsController")) {
            require_once(SERVER_ROOT . DS . 'application' . DS . 'controllers' . DS . 'notificationscontroller.php');
            require_once(SERVER_ROOT . DS . 'application' . DS . 'models' . DS . 'notification.php');
        }
        
        // save notification
        $result = performAction('notifications', 'queryWithStatus', array($query));

        // get badge notifications
        $badge = performAction('notifications', 'getNumberBadge', array($user_id));

        // #prep the bundle     
        $msg = array(
            'title'	=> $title,
            'body' 	=> $message,
            'badge' => $badge,
            'icon'	=> 'myicon',/*Default Icon*/
            'sound' => 'mySound'/*Default sound*/
            // 'content-available' => 0,
            // 'style' => 'inbox',
            // 'summaryText' => 'There are %n% notifications',
            // 'notId': 1
        );

        // Validate FCM registration ID
        $headers = array(
            'Authorization: key=' . API_ACCESS_KEY,
            'Content-Type: application/json'
        );
        $ch = curl_init();
        curl_setopt( $ch,CURLOPT_URL, 'https://iid.googleapis.com/iid/info/' . $token . '?details=true' );
        curl_setopt( $ch,CURLOPT_POST, false );
        curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
        $result1 = curl_exec($ch );
        logError(print_r($result1, true));
        $result2 = json_decode($result1, true);
        // Check platform
        if (isset($result2['platform']) && $result2['platform'] == "ANDROID") {
            // for Android
            $fields = array(
                'to' => $token,
                'data' => $msg
            );
        } else {
            // for iOS
            $fields = array(
                'to' => $token,
                'notification' => $msg
            );
        }
    
        $headers = array(
            'Authorization: key=' . API_ACCESS_KEY,
            'Content-Type: application/json'
        );
        #Send Reponse To FireBase Server	
        $ch = curl_init();
        curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
        curl_setopt( $ch,CURLOPT_POST, true );
        curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
        curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
        $result = curl_exec($ch );
        curl_close( $ch );
        logError(print_r($result, true));

        // {"multicast_id":6432239436887507566,"success":1,"failure":1,"canonical_ids":0,"results":[{"message_id":"0:1520827944262034%922280bf922280bf"},{"error":"InvalidRegistration"}]}
        return $result;
    }

}
?>