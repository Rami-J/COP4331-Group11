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
	$error = false;
	$searchResults = "";
	$searchCount = 0;
	$name = "";
	$userID = 0;
	$error_occurred = $inputData["userId"];

	// Retrieve field from JSON file
	$name = trimString($inputData["name"]);
	$userId = $inputData["userId"];

	// Connect to database
	$connection = new mysqli($serverName, $databaseUsername, $databasePassword, $databaseName);
	if ($connection->connect_error)
	{
		$error = true;
		returnError($connection->connect_error);
	}
	else
	{
		// Send the query to the database
		$sql = "SELECT * FROM Contact WHERE (CONCAT(firstName, ' ',lastName) LIKE '" . $name . "%'  OR CONCAT(lastName, ' ',firstName) LIKE '" . $name . "%') AND userId = '" . $userId . "'";

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
				$searchResults .= '"' . $rows["contactId"] . ' | ' . $rows["firstName"] . ' | ' . $rows["lastName"] . ' | ' . $rows["phoneNumber"] . ' | ' . $rows["address"] . ' | '. $rows["email"] . ' | ' . $rows["notes"] . '"';
			}
		}
		else
		{
			$error = true;
			returnError("Contact not found");
		}
		$connection->close();
	}

	if (!$error)
	{
		returnInfo( $searchResults );
	}

	/* Functions */

	// Parse JSON file input
	function getContactInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendJSON( $retValue );
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
		$retValue = '{"results":[],"error":"' . $err . '"}';
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
