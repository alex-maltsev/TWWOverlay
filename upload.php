<?php
    $tmp_file_name = $_FILES['img']['tmp_name'];
    // TODO: make sure that we have the temp name
    $file_name = 'uploads/'. uniqid() . '.jpg';
    $success = rename($tmp_file_name, $file_name);
    print $success ? $file_name : 'Unable to save the file.';
?>