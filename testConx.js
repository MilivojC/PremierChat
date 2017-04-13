

function testConx(){
var reponse;    
var request = require("request");
var options = { method: 'POST',
  url: 'https://lacliniqueduportable.vendhq.com/api/1.0/token',
  headers: 
   { 'cache-control': 'no-cache',
     'content-type': 'application/x-www-form-urlencoded' },
  form: 
   { code: 'c1ebDRULL9dmsB85sPdY0A4w1QwCi3B178P3QKy5',
     client_id: '7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc',
     client_secret: 'ZA0qaHzmT4yMGtGmUyj0dIrYQwhaBpfy',
     grant_type: 'authorization_code',
     redirect_uri: 'http://milivoy.screeb.io' } };
    
    
request(options, function (error, response, body) {
  if (error) throw new Error(error);


    return body;
});
 
};

console.log(testConx());