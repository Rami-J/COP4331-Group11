<?php


	$inputData = getLoginInfo();

	// Get database name
	$serverName = "localhost";
	$databaseUsername = "root";
	$databasePassword = "Wearegroup11!";
	$databaseName = "group11";

	// Memset fields to zero
	$userId = 0;
	$error = false;
	
	// Retrieve field from JSON file
	$username = $inputData["username"];
	$password = $inputData["password"];
	

	// Connect to database
	$connection = new mysqli($serverName, $databaseUsername, $databasePassword, $databaseName);
	if ($connection->connectError)
	{
		$error = true;
		returnError($connection->connectError);
	}
	else
	{

		$sql = "SELECT USER_ID FROM USERS where USERNAME = '" . $username . "' AND PASSWORD = '" . $password . "'";
		
		$result = $connection->query($sql);
		if ($result->num_rows > 0)
		{
			$row = $result->fetch_assoc();
			$userId = $row["USER_ID"];
		}
		else
		{
			$error = true;
			returnError( "User and Password Combination does not match" );
		}
		$connection->close();
	}
	
	// return the username
	if (!$error)
	{
		returnInfo($username, $userId);
	}
	
	/* Functions */

	// Parse JSON file input
	function getLoginInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	// Send the user's username and userId as JSON
	function sendJSON($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	// Return in the case of an error
	function returnError( $err )
	{
		$retValue = '{"userId":0,"username":"","error":"' . $err . '"}';
		sendJson( $retValue );
	}
	
	// Return and send the username and userId in JSON format
	function returnInfo( $username, $userId )
	{
		$retValue = '{"userId":' . $userId . ',"username":"' . $username . '","error":""}';
		sendJson( $retValue );
	}
?>

