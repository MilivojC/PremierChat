
function testConx(callback){

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
    console.log(body.toString());
      callback(body.toString());
  });
});

req.write(qs.stringify({ code: 'HCp3XWAAONmvTsXU1nNlYD9RJulCrHaNABGbENgG',
  client_id: '7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc',
  client_secret: 'ZA0qaHzmT4yMGtGmUyj0dIrYQwhaBpfy',
  grant_type: 'authorization_code',
  redirect_uri: 'http://milivoy.screeb.io' }));
req.end();

};




var datok;
testConx(function(result){
         datok = result;
        console.log("resultat:");
        console.log(result);
         
         });

console.log(datok);