var urlBase = 'https://cop4331-group11.team/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		console.log(xhr.responseText);
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.userId;

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}
		
		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();
	
		window.location.href = "dashboard.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignUp()
{
	login = "";
	password = "";
	
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	var login = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	
//	var hash = md5( password );
	
	document.getElementById("signInResult").innerHTML = "";

	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/add_user.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
		
		console.log(xhr.responseText);
		var jsonObject = JSON.parse( xhr.responseText );
		
		userId = jsonObject.userId;
		
		if( userId <= 0 )
		{
			document.getElementById("signInResult").innerHTML = jsonObject.error;
			return;
		}
		else
		{
			document.getElementById("signInResult").innerHTML = "Created Account";
		}

		saveCookie();
	
		window.location.href = "dashboard.html";
	}
	catch(err)
	{
		document.getElementById("signInResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function createContact()
{
	readCookie();
	
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var phoneNumber = document.getElementById("phoneNumber").value;
	var email = document.getElementById('email').value;
	var address = document.getElementById('address').value;
	var notes = document.getElementById('notes').value;

	document.getElementById("createContactResult").innerHTML = "";
	
	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "phoneNumber" : "' + phoneNumber + '", "email" : "' + email + '", "address" : "' + address + '", "notes" : "' + notes + '", "userId" : ' + userId + '}';

	console.log(userId);
	console.log(jsonPayload);

	var url = urlBase + '/create_contact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				var contactId = jsonObject.contactId;
				
				if( contactId < 1 )
				{
					document.getElementById("createContactResult").innerHTML = jsonObject.error;
					return;
				}
				else
				{
					// clear field
					document.getElementById('firstName').value = '';
					document.getElementById('lastName').value = '';
					document.getElementById('phoneNumber').value = '';
					document.getElementById('email').value = '';
					document.getElementById('address').value = '';
					document.getElementById('notes').value = '';		
					document.getElementById("createContactResult").innerHTML = "Created contact";

				}
			}
		}
		
		xhr.send(jsonPayload);
		console.log(xhr.responseText);
		
	}
	catch(err)
	{
		document.getElementById("createContactResult").innerHTML = err.message;
	}
}

function deleteContact()
{
	readCookie();
	
	var contactId = document.getElementById("contactId").value;
	
	var jsonPayload = '{"contactId" : "' + contactId + '", "userId" : "' + userId + '"}';;

	console.log(userId);
	console.log(jsonPayload);
	
	var url = urlBase + '/delete_contact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("deleteContactResult").innerHTML = "Contact has been deleted";

				var jsonObject = JSON.parse( xhr.responseText );
				var contactId = jsonObject.contactId;
				var firstName = jsonObject.firstName;
				var lastName = jsonObject.lastName;
				
				if( contactId < 1 )
				{
					document.getElementById("deleteContactResult").innerHTML = jsonObject.error;
					return;
				}
				else
				{
					document.getElementById('contactId').value = '';
					document.getElementById("deleteContactResult").innerHTML =  firstName + " " + lastName + " has been deleted";
				}
				
			}
		};
		xhr.send(jsonPayload);
		console.log(xhr.responseText);
	}

	catch(err)
	{
		document.getElementById("deleteContactResult").innerHTML = err.message;
	}
	
}

function emptyContactTable()
{
	var table = document.getElementById("searchTable").getElementsByTagName("tbody")[0];
	var rows = table.getElementsByTagName("tr");
	
	while(rows.length > 0)
	{
        table.removeChild(rows[0]);
    }
}

function searchContact()
{
	// memset search results
	emptyContactTable();

	readCookie();

	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var table;
	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "userId" : "' + userId + '"}';;

	console.log(userId);
	console.log(jsonPayload);

	var url = urlBase + '/search_contact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("searchContactResult").innerHTML = "Search Results:";
				var jsonObject = JSON.parse( xhr.responseText );
				
				// Get search results
				var searchResults = jsonObject.results;
				for(var i = searchResults.length - 1; i >= 0; i--)
				{
					contact = searchResults[i].split(" | ");
					table = document.getElementById("searchTable").getElementsByTagName("tbody")[0];

					var row = table.insertRow(0);
					row.insertCell(0).innerHTML = contact[0];
					row.insertCell(0).innerHTML = contact[6];
					row.insertCell(0).innerHTML = contact[5];
					row.insertCell(0).innerHTML = contact[4];
					row.insertCell(0).innerHTML = contact[3];
					row.insertCell(0).innerHTML = contact[2];
					row.insertCell(0).innerHTML = contact[1];
				}
			}
		};
		xhr.send(jsonPayload);
		
	}

	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

function updateContact()
{
	readCookie();
	
	var contactId = document.getElementById("contactId").value;
	var firstName = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var phoneNumber = document.getElementById("phoneNumber").value;
	var email = document.getElementById('email').value;
	var address = document.getElementById('address').value;
	var notes = document.getElementById('notes').value;

	document.getElementById("updateContactResult").innerHTML = "";
	
	var jsonPayload = '{"contactId" : "' + contactId + '", "userId" : "' + userId + '", "firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "phoneNumber" : "' + phoneNumber + '", "email" : "' + email + '", "address" : "' + address + '", "notes" : "' + notes + '"}';

	console.log(userId);
	console.log(jsonPayload);

	var url = urlBase + '/update_contact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				var contactId = jsonObject.contactId;
				
				if( contactId < 1 )
				{
					document.getElementById("updateContactResult").innerHTML = jsonObject.error;
					return;
				}
				else
				{
					document.getElementById('contactId').value = '';
					document.getElementById('firstName').value = '';
					document.getElementById('lastName').value = '';
					document.getElementById('phoneNumber').value = '';
					document.getElementById('email').value = '';
					document.getElementById('address').value = '';
					document.getElementById('notes').value = '';		
					document.getElementById("updateContactResult").innerHTML = "Updated contact";

				}
			}
		}
		
		xhr.send(jsonPayload);
		console.log(xhr.responseText);
	}
	catch(err)
	{
		document.getElementById("updateContactResult").innerHTML = err.message;
	}
}
