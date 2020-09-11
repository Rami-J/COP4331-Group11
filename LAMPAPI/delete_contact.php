<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	$inputData = getContactInfo();

	// Get database name	
	$serverName = "localhost";
	$databaseUsername = "rami_group11";
	$databasePassword = "Wearegroup11!";
    $databaseName = "rami_cop4331";
    
    // Memset fields to zero
    $userId = 0;
    $contactId = 0;
	$error = false;
	$login = "";
	$password = "";

	// Retrieve field from JSON file
	$firstName = trimString($inputData["firstName"]);
    $lastName = trimString($inputData["lastName"]);
    $userId = trimString($inputData["userId"]);

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
		returnError("Please enter a first/last name to delete.");
	}
	else
	{
		// Send the query to the database.
        $sql = 
        "SELECT contactId FROM Contact WHERE userId = '" . $userId . "' AND firstName = '" . $firstName . "' AND lastName = '" . $lastName . "'";
        
		$result = $connection->query($sql);

		// If the number of rows fetched is positive we found the contact to delete.
		if ($result->num_rows > 0)
		{
            // Get the contactId of the contact to be deleted.
            $contactId = ($result->fetch_assoc())["contactId"];

            // Make the query to delete the contact from the table.
            $sql = "DELETE FROM Contact WHERE contactId = '" . $contactId . "'";
            $result = $connection->query($sql);
        }
        else
        {
            $error = true;
            returnError("Could not find contact in table.");
        }
	}
	$connection->close();
	// Return the contact's id as JSON.
	if (!$error)
	{
		returnInfo($contactId);
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

	function returnInfo($contactId)
	{
		$retValue = '{"contactId":' . $contactId . ',"error":""}';
		sendJson( $retValue );
	}
	
	// Return in the case of an error
	function returnError( $err )
	{
		// return user name and error
		$retValue = '{"contactId":0,"error":"' . $err . '"}';
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