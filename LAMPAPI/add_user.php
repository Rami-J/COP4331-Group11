<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: *");
	$inputData = getSignUpInfo();

	// Get database name	
	$serverName = "localhost";
	$databaseUsername = "rami_group11";
	$databasePassword = "Wearegroup11!";
	$databaseName = "rami_cop4331";

	// Memset fields to zero
	$userId = 0;
	$error = false;
	$login = "";
	$password = "";

	// Retrieve field from JSON file
	$firstName = trimString($inputData["firstName"]);
	$lastName = trimString($inputData["lastName"]);
	$login = trimString($inputData["login"]);
	$password = trimString($inputData["password"]);
	
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
		returnError("Please enter a first/last name");
	}
	else if ( empty( $login ) || empty( $password ) )
	{
		$error = true;
		returnError("Please enter a username or password");
	}
	else
	{
		// Send the query to the database.
		$sql = "SELECT userId FROM User WHERE login = '" . $login . "'";
		$result = $connection->query($sql);

		// If the number of rows fetched is positive, login already exists
		if ($result->num_rows > 0)
		{
			$error = true;
			returnError("Username already exists" );
		}
		// We found a unique login
		else
		{
			$sql = "INSERT INTO User (firstName, lastName, login, password, dateCreated) VALUES ( '" . $firstName . "','" . $lastName . "','" . $login . "','" . $password . "',CURDATE())";
			if( !$result = $connection->query($sql))
			{
				$error = true;
				returnError( $connection->error );
			}

			// Get the id of the user's newly created account.
			$sql = "SELECT userId FROM User WHERE login = '" . $login . "'";
			$result = $connection->query($sql);
			$userId = ($result->fetch_assoc())["userId"];
		}		
	}
	$connection->close();
	// Return the user's login as JSON.
	if (!$error)
	{
		returnInfo($userId, $login);
	}

	/* Functions */

	// Parse JSON file input
	function getSignUpInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	// Send the user's login and password
	function sendJSON($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnInfo($userId, $login)
	{
		$retValue = '{"userId":' . $userId . ',"login":"' . $login . '","error":""}';
		sendJson( $retValue );
	}
	
	// Return in the case of an error
	function returnError( $err )
	{
		// return user name and error
		$retValue = '{"userId":0,"login":"","error":"' . $err . '"}';
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

?>
