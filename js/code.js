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

	// TODO: Add create contact result html field
	document.getElementById("createContactResult").innerHTML = "";
	
	// JSON is form of information + id as last field
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
		
				// clear field
				document.getElementById('firstName').value = '';
				document.getElementById('lastName').value = '';
				document.getElementById('phoneNumber').value = '';
				document.getElementById('email').value = '';
				document.getElementById('address').value = '';
				document.getElementById('notes').value = '';				
		
				if( contactId < 1 )
				{
					document.getElementById("createContactResult").innerHTML = jsonObject.error;
					return;
				}
				else
				{
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

function searchColor()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	var colorList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchColors.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
		
	}

	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}
