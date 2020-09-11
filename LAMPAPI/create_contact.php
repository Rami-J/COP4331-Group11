<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: http://cop4331-group11.team");
	$inputData = getContactInfo();

	// Get database name	
	$serverName = "localhost";
	$databaseUsername = "rami_group11";
	$databasePassword = "Wearegroup11!";
	$databaseName = "rami_cop4331";

	// Memset fields to zero
	$error = false;
    $userId = 0;
	$contactId = 0;
	$firstName = "";
	$lastName = "";
	$email = "";
	$phoneNumber = "";

	// Retrieve field from JSON file
	$firstName = trimString($inputData["firstName"]);
	$lastName = trimString($inputData["lastName"]);
	$phoneNumber = trimString($inputData["phoneNumber"]);
	$email = trimString($inputData["email"]);
	$address = trimString($inputData["address"]);
	$userId = trimString($inputData["userId"]);
	$notes = trimString($inputData["notes"]);

	// Connect to database
	$connection = new mysqli($serverName, $databaseUsername, $databasePassword, $databaseName);
	if ($connection->connect_error)
	{
		$error = true;
		returnError($connection->connect_error);
	}
	else if (empty( $firstName ) || empty( $lastName ))
	{
		$error = true;
		returnError("Please enter a first/last name of contact to add.");
	}
	else if (!validatePhoneNumber( $phoneNumber ))
	{
		$error = true;
		returnError("Please enter a valid phone number of the contact");
	}
	else if (!validateEmail( $email ))
	{
		$error = true;
		returnError("Please enter a valid email address of the contact");
	}
	else
	{
		// Send the query to the database.
        $sql = "INSERT INTO Contact (firstName, lastName, email, address, phoneNumber, notes, dateRecordCreated, userId)
				VALUES ('" . $firstName . "', '" . $lastName . "', '" . $email . "','" . $address . "','" . $phoneNumber . "','" . $notes . "'," . "CURDATE()," . $userId . ")";

		if( $result = $connection->query($sql) != TRUE )
		{
			$error = true;
			returnError( $connection->error );
		}

		$sql = "SELECT contactId FROM Contact WHERE userId = " . $userId . " AND firstName = '" . $firstName . "' AND lastName = '" . $lastName . "'";
		$result = $connection->query($sql);
		$contactId = ($result->fetch_assoc())["contactId"];
		$connection->close();
	}

	if (!$error)
	{
		returnInfo($contactId);
	}

	/* Functions */

	// Parse JSON file input
	function getContactInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	// Send the user's username and password
	function sendJSON($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnInfo($contactId)
	{
		$retValue = '{"contactId":' . $contactId . ',"error":""}';
		sendJSON( $retValue );
	}
	
	// Return in the case of an error
	function returnError( $err )
	{
		// return user name and error
		$retValue = '{"contactId":0, "error":"' . $err . '"}';
		sendJson( $retValue );
	}

	// Return string without whitespace and semi colons
	function trimString( $string )
	{
		$string = trim($string);
		$string = str_replace('"', '', $string);
		$string = str_replace("'", '', $string);
		$string = str_replace(';', '', $string);
		return $string;
	}

	// Validation for the mobile field
	function validatePhoneNumber($phoneNumber)
	{
		$isMobileNumberValid = FALSE;
		if (!empty($phoneNumber)) 
		{
			$isMobileNumberValid = TRUE;
			if (!preg_match("/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/", $phoneNumber))
			{
				$isMobileNumberValid = FALSE;
			}
		}
		return $isMobileNumberValid;
	}

	// Validation for the email field
	function validateEmail($email)
	{
		$isEmailValid = FALSE;
		if (!empty($email)) 
		{
			$isEmailValid = TRUE;
			if (!preg_match("/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/", $email)) 
			{
				$isEmailValid = FALSE;
			}
		}
		return $isEmailValid;
	  }

?>

