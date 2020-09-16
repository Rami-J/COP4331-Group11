<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");

	$inputData = getContactInfo();

	// Get database name	
	$serverName = "localhost";
	$databaseUsername = "rami_group11";
	$databasePassword = "Wearegroup11!";
    $databaseName = "rami_cop4331";
	
	// Retrieve field from JSON file
	$userId = $inputData["userId"];
	$contactId = $inputData["contactId"];
	$firstName = trimString($inputData["firstName"]);
	$lastName = trimString($inputData["lastName"]);
	$email = trimString($inputData["email"]);
	$address = trimString($inputData["address"]);
	$phoneNumber = trimString($inputData["phoneNumber"]);
	$notes = trimString($inputData["notes"]);

	$error = false;

    // Connect to database
	$connection = new mysqli($serverName, $databaseUsername, $databasePassword, $databaseName);
	if ($connection->connect_error)
	{
		$error = true;
		returnError($connection->connect_error);
	}
	else if (empty($firstName) || empty($lastName))
	{
		$error = true;
		returnError("Please enter a non-empty first/last name");
	}
	else if (validatePhoneNumber( $phoneNumber ) === FALSE)
	{
		$error = true;
		returnError("Please enter a valid phone number of the contact in the format XXX-XXX-XXXX");
	}
	else if ( !empty( $email ) && !filter_var( $email, FILTER_VALIDATE_EMAIL) )
	{
		$error = true;
		returnError("Please enter a valid email address of the contact");
	}
	else
	{
		$sql = "SELECT * FROM Contact WHERE contactId = '" . $contactId . "' AND userId = '" . $userId . "'";
		$result = $connection->query($sql);

		if ($result->num_rows == 0)
		{
			$error = true;
			returnError("Could not find contact in table.");
		}
		else
		{
			$sql = "UPDATE Contact SET firstName = '" . $firstName . "', lastName = '" . $lastName . "', email = '" . $email . "', address = '" . $address . 
					"', phoneNumber = '" . $phoneNumber . "', notes = '" . $notes . "' WHERE contactId = '" . $contactId . "' AND userId = '" . $userId . "'";

			$result = $connection->query($sql);

			$connection->close();
		}
	}

	if (!$error)
	{
		returnInfo($contactId, $firstName, $lastName);
	}

	/* Functions */

    function getContactInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    // Send the user's login and password
	function sendJSON($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnInfo($contactId, $firstName, $lastName)
	{
		$retValue = '{"contactId":' . $contactId . ',"firstName":"' . $firstName . '", "lastName":"' . $lastName . '","error":""}';
		sendJson( $retValue );
	}
	
	// Return in the case of an error
	function returnError( $err )
	{
		// return user name and error
		$retValue = '{"contactId":0, "firstName":"", "lastName":"", "error":"' . $err . '"}';
		sendJson( $retValue );
	}

	// Return string without whitespace and semi colons
	function trimString( $string )
	{
		$string = trim($string);
		$string = str_replace('"', '', $string);
		$string = str_replace("'", '', $string);
		return str_replace(';', '', $string);
	}

	// Validation for the mobile field
	function validatePhoneNumber($phoneNumber)
	{
		$isMobileNumberValid = FALSE;
		if (!empty($phoneNumber) && preg_match('/^(\+1|001)?\(?([0-9]{3})\)?([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})/', $phoneNumber)) 
		{
			$isMobileNumberValid = TRUE;
		}
		return $isMobileNumberValid;
	}
?>