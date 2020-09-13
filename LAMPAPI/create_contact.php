<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	$inputData = getCreateContactInfo();

	// Get database name	
	$serverName = "localhost";
	$databaseUsername = "rami_group11";
	$databasePassword = "Wearegroup11!";
	$databaseName = "rami_cop4331";

	// Memset fields to deafault files
	$error = false;
    $userId = $inputData["userId"];
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
	else if (validatePhoneNumber( $phoneNumber ) === FALSE)
	{
		$error = true;
		returnError("Please enter a valid phone number of the contact in the format XXX-XXX-XXXX");
	}
	else if (!filter_var( $email, FILTER_VALIDATE_EMAIL) )
	{
		$error = true;
		returnError("Please enter a valid email address of the contact");
	}
	else
	{
		// Send the query to the database.
        $sql = "INSERT INTO Contact (firstName, lastName, email, address, phoneNumber, notes, dateRecordCreated, userId)
				VALUES ('" . $firstName . "', '" . $lastName . "','" . $email . "','" . $address . "','" . $phoneNumber . "','" . $notes . "', CURDATE(),'" . $userId . "')";

		if( $result = $connection->query($sql) != TRUE )
		{
			$error = true;
			returnError( $connection->error );
		}

		$sql = "SELECT contactId FROM Contact WHERE userId = '" . $userId . "' AND firstName = '" . $firstName . "' AND lastName = '" . $lastName . "'";
		$result = $connection->query($sql);
		$contactId = ($result->fetch_assoc())["contactId"];


		$connection->close();
	}

	if (!$error)
	{
		returnInfo($userId, $firstName, $lastName, $phoneNumber, $email, $notes );
	}

	/* Functions */

	// Parse JSON file input
	function getCreateContactInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	// Send the user's username and password
	function sendJSON($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnInfo( $userId, $firstName, $lastName, $phoneNumber, $email, $notes )
	{
		$retValue = '{"userId": "' . $userId . '", "firstName": "' . $firstName .'","lastName": "' . $lastName . '","phoneNumber": "' . $phoneNumber . '",
					  "email": "' . $email . '",  "notes": "' . $notes . '",  "error": ""}';
		sendJson( $retValue );
	}

	$address = trimString($inputData["address"]);
	$notes = trimString($inputData["notes"]);

	// Return in the case of an error
	function returnError( $err )
	{
		// return user name and error
		$retValue = '{"contactId":" ","error":"' . $err . '"}';
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
			if (preg_match('/^(\+1|001)?\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})/', $phoneNumber)) 
			{
				$isMobileNumberValid = TRUE;
			}
		}
		return $isMobileNumberValid;
	}
?>
