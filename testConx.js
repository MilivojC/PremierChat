
function testConx(){
var data = 'Pas de token';    
var request = require("request");
var options = { method: 'POST',
  url: 'https://lacliniqueduportable.vendhq.com/api/1.0/token',
  headers: 
   { 'cache-control': 'no-cache',
     'content-type': 'application/x-www-form-urlencoded' },
  form: 
   { code: 'ebmC8qLP6xs1pCfbHatslrL0UN8RQLU7HytZJS6R',
     client_id: '7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc',
     client_secret: 'ZA0qaHzmT4yMGtGmUyj0dIrYQwhaBpfy',
     grant_type: 'authorization_code',
     redirect_uri: 'http://milivoy.screeb.io' } };
    
    
request(options, function (error, response, body) {
  if (error) throw new Error(error);
data = body;
});
  
var i =0;    
while (i == 0){
    if (data=='Pas de token'){
        console.log("data non affectée");
        
    }
    else {
        console.log ("data affecte!");
        i=1;
        console.log(data);
        return data;
    }
}    
    
    

};


console.log(testConx(bodyreq,testConx(bodyreq)));
console.log(bodyreq);
bodyreq= testConx(bodyreq,testConx(bodyreq));
console.log(bodyreq);