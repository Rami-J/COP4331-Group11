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
	$searchResults = "";
	$searchCount = 0;
	$firstName = "";
	$lastName = "";
	$userID = 0;
	$error_occurred = false;

	// Retrieve field from JSON file
	$firstName = trimString($inputData["firstName"]);
	$lastName = trimString($inputData["lastName"]);
	$phoneNumber = trimString($inputData["phoneNumber"]);
	$email = trimString($inputData["email"]);
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
		returnError("Please enter a first/last name of contact to search");
	}
	else
	{
		// Send the query to the database.
		$sql = "SELECT * from Contact where firstName LIKE '%" . $firstName . "%' AND lastName LIKE '%" . $lastName . "%' AND userId = " . $userID;
		$result = $connection->query($sql);
		if( $result != TRUE )
		{
			$error = true;
			returnError( $connection->error );
		}
		if ( $result->num_rows > 0 )
		{
			while( $rows = $result->fetch_assoc() )
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
		
				$searchCount++;
				$searchResults .= '"' . $rows["contactId"] . ' | ' . $rows["firstName"] . ' | ' . $rows["lastName"] . ' | ' . $rows["phoneNumber"] . ' | ' . $rows["email"] . ' | ' . $rows["notes"] . '"';
			}
		}
		$connection->close();
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
	
	// Return in the case of an error
	function returnError( $err )
	{
		// return user name and error
		$retValue = '{"username":" ","error":"' . $err . '"}';
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
