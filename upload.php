<?php
    // Making sure that we got the file
    $tmp_file_name = $_FILES['img']['tmp_name'];
    if ($tmp_file_name == NULL) {
        respondWithError("Didn't receive image file");
        exit;
    }

    // Making sure that we got the access token
    $token = $_POST['token'];
    if ($token == NULL) {
        respondWithError("Missing access token");
        exit;
    }

    $file_name = 'uploads/'. uniqid() . '.jpg';
    $success = rename($tmp_file_name, $file_name);
    if ($success) {
        uploadImage($file_name, $token);
    } else {
        respondWithError("Unable to save image file");
    }

    function uploadImage($file_name, $token) {
        require('Facebook/autoload.php');
        require('cred.php');
        $arr = array('success' => TRUE, 'file' => $file_name);
        echo json_encode($arr);
    }

    function respondWithError($error_message) {
        $arr = array('success' => FALSE, 'error' => $error_message);
        echo json_encode($arr);
    }
?>