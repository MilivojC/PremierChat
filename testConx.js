
function testConx(getdata ,callback){

var qs = require("querystring");
var http = require("https");

var options = {
  "method": "POST",
  "hostname": "lacliniqueduportable.vendhq.com",
  "port": null,
  "path": "/api/1.0/token",
  "headers": {
    "content-type": "application/x-www-form-urlencoded",
    "cache-control": "no-cache"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);

      callback(getdata, body.toString());
  });
});

req.write(qs.stringify({ code: 'baPaGDzYBS5RryAk3mjF6dPeaULjbbz1pS9UUGHk',
  client_id: '7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc',
  client_secret: 'ZA0qaHzmT4yMGtGmUyj0dIrYQwhaBpfy',
  grant_type: 'authorization_code',
  redirect_uri: 'http://milivoy.screeb.io' }));
req.end();


};



function finalLink(){
 var datok;
testConx(datok , function(datok , result){
         datok = result;
         });
autre(datok);
    
    
};

function autre(datok){
    
    console.log("autre fonction")
    console.log(datok);
}

finalLink();











