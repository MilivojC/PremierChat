
function testConx(){
var data = 'Pas de token',
    triger = false;
var request = require("request");
var options = { method: 'POST',
  url: 'https://lacliniqueduportable.vendhq.com/api/1.0/token',
  headers: 
   { 'cache-control': 'no-cache',
     'content-type': 'application/x-www-form-urlencoded' },
  form: 
   { code: 'gQmEtzzLPoyNzhSI6Yrm1CzYoNX1JWsydNGChJIp',
     client_id: '7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc',
     client_secret: 'ZA0qaHzmT4yMGtGmUyj0dIrYQwhaBpfy',
     grant_type: 'authorization_code',
     redirect_uri: 'http://milivoy.screeb.io' } };
    
    
request(options, function (error, response, body) {
  if (error) throw new Error(error);
data = body;
    console.log(data);
}).success(function(body){
    data = body;
    console.log(data);
});

    console.log(data);
};

testConx();