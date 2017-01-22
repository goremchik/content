<?php
$output_dir = "D:/epam/build/files/";
$response = array('status' => 0);
if(isset($_FILES["myfile"]))
{
    $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : "";
	$ret = "";
	$error = $_FILES["myfile"]["error"];

		if ($type !== "") {
    	    $output_dir .= $type . "/";
    	}

	//If Any browser does not support serializing of multiple files using FormData()
	if(!is_array($_FILES["myfile"]["name"])) { //single file
 	 	$fileName = $_FILES["myfile"]["name"];
 		move_uploaded_file($_FILES["myfile"]["tmp_name"], $output_dir . $fileName);
    	$ret = $fileName;

	} else { //Multiple files, file[]
	  $fileCount = count($_FILES["myfile"]["name"]);

	  if($fileCount > 0) {
	  	$fileName = $_FILES["myfile"]["name"][0];
		move_uploaded_file($_FILES["myfile"]["tmp_name"][0], $output_dir . $fileName);
	  	$ret = $fileName;
	  }
	}

    if ($ret !== "") {
        $response['status'] = 1;
        $response['fileName'] = $ret;
    } else {
        $response['error'] = $error;
    }

    echo json_encode($response);
 }
 ?>