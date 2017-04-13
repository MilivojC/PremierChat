


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

      callback(body.toString());
  });
});

req.write(qs.stringify({ code: 'YMpE0z6F6phocs6YpqNBnX9GGfd42bs0XOAkim6v',
  client_id: '7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc',
  client_secret: 'ZA0qaHzmT4yMGtGmUyj0dIrYQwhaBpfy',
  grant_type: 'authorization_code',
  redirect_uri: 'http://milivoy.screeb.io' }));
req.end();


};


  



function final(){

var f;
testConx(function(result){
        f=result;
        console.log(result);
         });
    
setTimeout(function(){
    console.log(f);
}, 20000);
}





