var urlBase = 'https://cop4331-group11.team/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    var login = document.getElementById("loginName").value;
    var password = document.getElementById("loginPassword").value;
    var hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";

    var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
    var url = urlBase + '/login.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.send(jsonPayload);

        console.log(xhr.responseText);
        var jsonObject = JSON.parse(xhr.responseText);

        userId = jsonObject.userId;

        if (userId < 1) {
            document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
            return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "dashboard.html";
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

function doSignUp() {
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    var login = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var hash = md5(password);

    document.getElementById("signInResult").innerHTML = "";

    var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "login" : "' + login + '", "password" : "' + hash + '"}';
    var url = urlBase + '/add_user.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.send(jsonPayload);

        console.log(xhr.responseText);
        var jsonObject = JSON.parse(xhr.responseText);

        userId = jsonObject.userId;

        if (userId <= 0) {
            document.getElementById("signInResult").innerHTML = jsonObject.error;
            return;
        } else {
            document.getElementById("signInResult").innerHTML = "Created Account";
        }

        saveCookie();

        window.location.href = "dashboard.html";
    } catch (err) {
        document.getElementById("signInResult").innerHTML = err.message;
    }

}

function saveCookie() {
    var minutes = 20;
    var date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    var data = document.cookie;
    var splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        var thisOne = splits[i].trim();
        var tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } else if (window.location.href === "https://cop4331-group11.team/dashboard.html"){
        document.getElementById("username").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function buttonTimeout(obj) {
    obj.disabled = true;
    setTimeout(function() {
        obj.disabled = false;
    }, 2000);
}


function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function createContact() {
    readCookie();

    var contactFirstName = document.getElementById("firstName").value;
    var contactLastName = document.getElementById("lastName").value;
    var phoneNumber = document.getElementById("phoneNumber").value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var notes = document.getElementById('notes').value;

    document.getElementById("createContactResult").innerHTML = "";

    var jsonPayload = '{"firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "phoneNumber" : "' + phoneNumber + '", "email" : "' + email + '", "address" : "' + address + '", "notes" : "' + notes + '", "userId" : ' + userId + '}';

    console.log(userId);
    console.log(jsonPayload);

    var url = urlBase + '/create_contact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);
                var contactId = jsonObject.contactId;

                if (contactId < 1) {
                    document.getElementById("createContactResult").innerHTML = jsonObject.error;
                    return;
                } else {
                    // clear field
                    document.getElementById('firstName').value = '';
                    document.getElementById('lastName').value = '';
                    document.getElementById('phoneNumber').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('address').value = '';
                    document.getElementById('notes').value = '';
                    document.getElementById("createContactResult").innerHTML = "Created contact " + contactFirstName + " " + contactLastName;

                }
            }
        }

        xhr.send(jsonPayload);
        console.log(xhr.responseText);

    } catch (err) {
        document.getElementById("createContactResult").innerHTML = err.message;
    }
}

function deleteContact() {
    readCookie();

    var contactId = document.getElementById("contactId").value;

    var jsonPayload = '{"contactId" : "' + contactId + '", "userId" : "' + userId + '"}';

    console.log(userId);
    console.log(jsonPayload);

    var url = urlBase + '/delete_contact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("deleteContactResult").innerHTML = "Contact has been deleted";

                var jsonObject = JSON.parse(xhr.responseText);
                contactId = jsonObject.contactId;
                var contactFirstName = jsonObject.firstName;
                var contactLastName = jsonObject.lastName;

                if (contactId < 1) {
                    document.getElementById("deleteContactResult").innerHTML = jsonObject.error;
                    return;
                } else {
                    document.getElementById('contactId').value = '';
                    document.getElementById("deleteContactResult").innerHTML = contactFirstName + " " + contactLastName + " has been deleted";
                }

            }
        };
        xhr.send(jsonPayload);
        console.log(xhr.responseText);
    } catch (err) {
        document.getElementById("deleteContactResult").innerHTML = err.message;
    }

}

function emptyContactTable() {
    var table = document.getElementById("searchTable").getElementsByTagName("tbody")[0];
    var rows = table.getElementsByTagName("tr");

    while (rows.length > 0) {
        table.removeChild(rows[0]);
    }
    document.getElementById("deleteContactResult").innerHTML = "";
    document.getElementById("updateContactResult").innerHTML = "";
}

function deleteContactFromSearch(contactId, rowId) {
    readCookie();
    console.log("contact id: " + contactId);

    var jsonPayload = '{"contactId" : "' + contactId + '", "userId" : "' + userId + '"}';

    console.log(userId);
    console.log(jsonPayload);

    var url = urlBase + '/delete_contact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //document.getElementById("deleteContactResult").innerHTML = "Contact has been deleted";

                var jsonObject = JSON.parse(xhr.responseText);
                contactId = jsonObject.contactId;
                var contactFirstName = jsonObject.firstName;
                var contactLastName = jsonObject.lastName;

                document.getElementById("updateContactResult").innerHTML = "";
                if (contactId < 1) {
                    document.getElementById("deleteContactResult").innerHTML = jsonObject.error;
                    return;
                } else {
                    var table = document.getElementById("searchTable").getElementsByTagName("tbody")[0];
                    table.removeChild(document.getElementById(rowId));
                    document.getElementById("deleteContactResult").innerHTML = contactFirstName + " " + contactLastName + " has been deleted";
                }

            }
        };
        xhr.send(jsonPayload);
        console.log(xhr.responseText);
    } catch (err) {
        document.getElementById("deleteContactResult").innerHTML = err.message;
    }
}

function updateContactFromSearch(contactId, rowId) {
    readCookie();

    console.log("Contact Id: " + contactId);

    var row = document.getElementById(rowId);
    var cols = row.getElementsByTagName("td");

    var contactFirstName = cols[0].getElementsByTagName("input")[0].value;
    var contactLastName = cols[1].getElementsByTagName("input")[0].value;
    var phoneNumber = cols[2].getElementsByTagName("input")[0].value;
    var address = cols[3].getElementsByTagName("input")[0].value;
    var email = cols[4].getElementsByTagName("input")[0].value;
    var notes = cols[5].getElementsByTagName("input")[0].value;

    var jsonPayload = '{"contactId" : "' + contactId + '", "userId" : "' + userId + '", "firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "phoneNumber" : "' + phoneNumber + '", "email" : "' + email + '", "address" : "' + address + '", "notes" : "' + notes + '"}';

    console.log(userId);
    console.log(jsonPayload);

    var url = urlBase + '/update_contact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);
                contactId = jsonObject.contactId;

                document.getElementById("deleteContactResult").innerHTML = "";
                if (contactId < 1) {
                    document.getElementById("updateContactResult").innerHTML = jsonObject.error;
                    return;
                } else {
                    document.getElementById("updateContactResult").innerHTML = "Updated Contact " + contactFirstName + " " + contactLastName;
                }
            }
        }

        xhr.send(jsonPayload);
        console.log(xhr.responseText);
    } catch (err) {
        document.getElementById("updateContactResult").innerHTML = err.message;
    }
}

function show() {
    document.getElementById("searchTable").style.display="block";
}

function searchContact() {
    // memset search results
    emptyContactTable();
    show();
    readCookie();

    var name = document.getElementById("name").value;

    var table;
    var jsonPayload = '{"name" : "' + name + '", "userId" : "' + userId + '"}';

    console.log(userId);
    console.log(jsonPayload);

    var url = urlBase + '/search_contact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);

                // Get search results
                var searchResults = jsonObject.results;
                var rowId = 0;
                for (var i = searchResults.length - 1; i >= 0; i--) {
                    var contact = searchResults[i].split(" | ");
                    table = document.getElementById("searchTable").getElementsByTagName("tbody")[0];

                    var row = table.insertRow(0);
                    row.setAttribute("id", rowId);

                    // Update/Delete buttons.
                    row.insertCell(0).innerHTML = '<button type="button" id="deleteButton" class="btn" onclick="deleteContactFromSearch(' +
                        contact[0] + ',' + rowId + ');">Delete</button>';
                    row.insertCell(0).innerHTML = '<button type="button" id="updateButton" class="btn" onclick="updateContactFromSearch(' +
                        contact[0] + ',' + rowId + ');">Update</button>';

                    // Textfield inputs for each contact row.	
                    row.insertCell(0).innerHTML = '<input type="text" class="textField" id="ContactId" readonly>';
                    row.insertCell(0).innerHTML = '<input type="text" class="textField" id="notesField">';
                    row.insertCell(0).innerHTML = '<input type="text" class="textField" id="emailField">';
                    row.insertCell(0).innerHTML = '<input type="text" class="textField" id="addressField">';
                    row.insertCell(0).innerHTML = '<input type="text" class="textField" id="phoneField">';
                    row.insertCell(0).innerHTML = '<input type="text" class="textField" id="lastNameField">';
                    row.insertCell(0).innerHTML = '<input type="text" class="textField" id="firstNameField">';

                    // Prefill the contact info with the search results.
                    var cols = row.getElementsByTagName("td");
                    cols[6].getElementsByTagName("input")[0].value = contact[0];
                    cols[5].getElementsByTagName("input")[0].value = contact[6];
                    cols[4].getElementsByTagName("input")[0].value = contact[5];
                    cols[3].getElementsByTagName("input")[0].value = contact[4];
                    cols[2].getElementsByTagName("input")[0].value = contact[3];
                    cols[1].getElementsByTagName("input")[0].value = contact[2];
                    cols[0].getElementsByTagName("input")[0].value = contact[1];

                    rowId++;
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("searchContactResult").innerHTML = err.message;
    }
}

function updateContact() {
    readCookie();

    var contactId = document.getElementById("contactId").value;
    var contactFirstName = document.getElementById("firstName").value;
    var contactLastName = document.getElementById("lastName").value;
    var phoneNumber = document.getElementById("phoneNumber").value;
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var notes = document.getElementById('notes').value;

    document.getElementById("updateContactResult").innerHTML = "";

    var jsonPayload = '{"contactId" : "' + contactId + '", "userId" : "' + userId + '", "firstName" : "' + contactFirstName + '", "lastName" : "' + contactLastName + '", "phoneNumber" : "' + phoneNumber + '", "email" : "' + email + '", "address" : "' + address + '", "notes" : "' + notes + '"}';

    console.log(userId);
    console.log(jsonPayload);

    var url = urlBase + '/update_contact.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);
                contactId = jsonObject.contactId;

                if (contactId < 1) {
                    document.getElementById("updateContactResult").innerHTML = jsonObject.error;
                    return;
                } else {
                    document.getElementById('contactId').value = '';
                    document.getElementById('firstName').value = '';
                    document.getElementById('lastName').value = '';
                    document.getElementById('phoneNumber').value = '';
                    document.getElementById('email').value = '';
                    document.getElementById('address').value = '';
                    document.getElementById('notes').value = '';
                    document.getElementById("updateContactResult").innerHTML = "Updated contact " + contactFirstName + " " + contactLastName;
                }
            }
        }

        xhr.send(jsonPayload);
        console.log(xhr.responseText);
    } catch (err) {
        document.getElementById("updateContactResult").innerHTML = err.message;
    }
}