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

    // Moving image from temp folder to 'uploads' folder
    $file_name = 'uploads/'. uniqid() . '.jpg';
    $success = rename($tmp_file_name, $file_name);
    if ($success) {
        chmod($file_name, 0644); // Enable read for everybody

        $message = $_POST['message'];
        if ($message == NULL) $message = '';
        $should_post = ($_POST['should_post'] === 'true');
        uploadImage($file_name, $token, $message, $should_post);
    } else {
        respondWithError("Unable to save image file");
    }

    function uploadImage($file_name, $token, $message, $should_post) {
        // Initialize Facebook SDK
        require('Facebook/autoload.php');
        require('cred.php');
        $fb = new Facebook\Facebook([
            'app_id' => $_APP_ID,
            'app_secret' => $_APP_SECRET,
            'default_graph_version' => 'v2.5',
        ]);
 
        try {
            $post_data = [
                'message' => $message,
                'source' => $fb->fileToUpload($_BASE_URL . $file_name),
                'no_story' => !$should_post
            ];
            // Returns a `Facebook\FacebookResponse` object
            $response = $fb->post('/me/photos', $post_data, $token);
            // Remove the image file from our server
            // Should be okay because FB should have grabbed it by this point
            unlink($file_name);
        } catch (Exception $e) {
            unlink($file_name);
            respondWithError('Facebook error: ' . $e->getMessage());
            exit;
        }

        $graphNode = $response->getGraphNode();
        $arr = array('success' => TRUE, 'photo_id' => $graphNode['id']);
        echo json_encode($arr);
    }

    function respondWithError($error_message) {
        $arr = array('success' => FALSE, 'error' => $error_message);
        echo json_encode($arr);
    }
?>