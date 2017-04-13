

function testConx(){
var reponse;    
var request = require("request");

var options = { method: 'POST',
  url: 'https://lacliniqueduportable.vendhq.com/api/1.0/token',
  headers: 
   { 'cache-control': 'no-cache',
     'content-type': 'application/x-www-form-urlencoded' },
  form: 
   { code: 'zMXJihMAC5kPfDG3elZRbqHwARMDmF6OYfjOdoLq',
     client_id: '7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc',
     client_secret: 'ZA0qaHzmT4yMGtGmUyj0dIrYQwhaBpfy',
     grant_type: 'authorization_code',
     redirect_uri: 'http://milivoy.screeb.io' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
    reponse = body.access_token;
});
  console.log(reponse);
return "execution!";    
};

console.log(testConx());