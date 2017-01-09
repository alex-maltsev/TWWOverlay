<?php
    $tmp_file_name = $_FILES['img']['tmp_name'];
    if ($tmp_file_name == NULL) {
        respondWithError("Didn't receive image file");
        exit;
    }

    $file_name = 'uploads/'. uniqid() . '.jpg';
    $success = rename($tmp_file_name, $file_name);
    if ($success) {
        $arr = array('success' => TRUE, 'file' => $file_name);
        echo json_encode($arr);
     } else {
        respondWithError("Unable to save image file");
    }

    function respondWithError($error_message) {
        $arr = array('success' => FALSE, 'error' => $error_message);
        echo json_encode($arr);
    }
?>