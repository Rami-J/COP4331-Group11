<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	$inputData = getContactInfo();

	// Get database name	
	$serverName = "localhost";
	$databaseUsername = "rami_group11";
	$databasePassword = "Wearegroup11!";
    $databaseName = "rami_cop4331";
    
    // Memset fields to default values
	$contactId = 0;
	$firstName = "";
	$lastName = "";
	$error = false;

	// Retrieve field from JSON file
	$userId = $inputData["userId"];
	$contactId = $inputData["contactId"];

    // Connect to database
	$connection = new mysqli($serverName, $databaseUsername, $databasePassword, $databaseName);
	if ($connection->connect_error)
	{
		$error = true;
		returnError($connection->connect_error);
	}
	else
	{
		// Send the query to the database.
		$sql = "SELECT firstName, lastName, contactId FROM Contact WHERE contactId = '" . $contactId . "' AND userId = '" . $userId . "'";
		$result = $connection->query($sql);

		if ($result->num_rows == 0)
		{
            $error = true;
            returnError("Could not find contact in table.");
		}
		else
		{
			// store first name / last name
			$row = $result->fetch_assoc();
			$firstName = $row["firstName"];
			$lastName = $row["lastName"];
			
			// then delete
			$sql = "DELETE FROM Contact WHERE contactId = '" . $contactId . "' AND userId = '" . $userId . "'";
			$result = $connection->query($sql);
		}
	}
	$connection->close();

	// Return the contact's id as JSON.
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
		$string = str_replace(';', '', $string);
		return $string;
	}

?>