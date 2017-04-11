var socket = io.connect('http://milivoy.screeb.io');

//socket.emit('jesuisla');
$('#formulaire_login').submit(function () {

    

    
    
    if ($.browser.safari)
        {
            this.action += '?t=' + new Date().getTime();
            this.submit();
        }
    else {
            this.submit();
         };
    
    
   
    return false;
},function () {
 
    $('#Username').val('').focus(); 
    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
    socket.emit('verification');    
 
});




socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});
