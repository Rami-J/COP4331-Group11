<?php
	header("Access-Control-Allow-Headers: Content-type");
	header("Access-Control-Allow-Origin: http://cop4331-group11.team");
	$inputData = getLoginInfo();

	// Get database name	
	$serverName = "localhost";
	$databaseUsername = "rami_group11";
	$databasePassword = "Wearegroup11!";
	$databaseName = "rami_cop4331";

	// Memset fields to zero
	$userId = 0;
	$error = false;
	$firstName = "";
	$lastName = "";
	
	// Retrieve field from JSON file
	$login = trimString($inputData["login"]);
	$password = trimString($inputData["password"]);
	
	// Connect to database
	$connection = new mysqli($serverName, $databaseUsername, $databasePassword, $databaseName);
	if ($connection->connectError)
	{
		$error = true;
		returnError($connection->connectError);
	}
	else
	{
		// Send the query to the database.
		$sql = "SELECT userId, firstName, lastName FROM User WHERE login = '" . $login . "' AND password = '" . $password . "'";
		$result = $connection->query($sql);

		// If the number of rows fetched is positive, get the user's id, first name, and last name.
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$userId = $row["userId"];
			$firstName = $row["firstName"];
			$lastName = $row["lastName"];
		}
		else
		{
			$error = true;
			returnError( "User and Password Combination does not match" );
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
	
	// Send the user's login and userId as JSON
	function sendJSON($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	// Return in the case of an error
	function returnError( $err )
	{
		$retValue = '{"userId":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendJson( $retValue );
	}
	
	// Return and send the login and userId in JSON format
	function returnInfo( $firstName, $lastName, $userId )
	{
		$retValue = '{"userId":' . $userId . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
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
