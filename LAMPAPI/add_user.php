<?php

	$inputData = getLoginInfo();

	// Get database name
	$serverName = "localhost";
	$databaseUsername = "group11";
	$databasePassword = "Wearegroup11!";
	$databaseName = "cop4331";

	// Memset fields to zero
	$error = false;
	$username = "";
	$password = "";

	// Retrieve field from JSON file
	$username = trimString($inputData["username"]);
	$password = trimString($inputData["password"]);
	

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
		$sql = "SELECT userId FROM users WHERE USERNAME = '" . $username . "'";
		$result = $connection->query($sql);

		// If the number of rows fetched is positive, username already exists
		if ($result->num_rows > 0)
		{
			$error = true;
			returnError( "User" );
		}
		// We found a unique username
		else
		{
			$sql = "INSERT into users VALUES ('" . $username . "','" . $password . "')";
			if( $result = $connection->query($sql) != TRUE )
			{
				$error = true;
				returnWithError( $connection->error );
			}
		}		
		$connection->close();
	}
	
	// Return the user's first name, last name, and userid as JSON.
	if (!$error)
	{
		returnInfo($firstName, $lastName, $userId);
	}
	
	/* Functions */

	// Parse JSON file input
	function getLoginInfo()
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

