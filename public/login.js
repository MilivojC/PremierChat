var socket = io.connect('http://milivoy.screeb.io');

//socket.emit('jesuisla');
$('#formulaire_login').submit(function () {

    var data = {
        Username : document.getElementById("Username").value,
        password : document.getElementById("password").value
    }
    
    $.post("http://milivoy.screeb.io/login", { json_string:JSON.stringify(data) });
    
    console.log(data);
//    var xhr = getXMLHttpRequest();
//    xhr.open("POST", "http://milivoy.screeb.io/login", false);
//    xhr.setRequestHeader("Content-Type", "application/json");
//    xhr.send(JSON.stringify(data));
//    $('#Username').val('').focus(); 
//    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
//    socket.emit('verification');
    return false;
});

socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});




function getXMLHttpRequest() {
	var xhr = null;
	
	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} else {
			xhr = new XMLHttpRequest(); 
		}
	} else {
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}
	
	return xhr;
}