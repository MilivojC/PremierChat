

function testConx(){
var reponse;    
var code = 'vbNVlP3cXwUMfyUgC29bpyxW5YXbooet5jW6660Z';
var codeV =  code,
    client_idV = '7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc',
    client_secretV = 'ZA0qaHzmT4yMGtGmUyj0dIrYQwhaBpfy',
    redirect_uriV = 'http://milivoy.screeb.io';
        //var request = require("request");
    var rp = require('request-promise');
    var options = { 
                method: 'POST',
                url: 'https://lacliniqueduportable.vendhq.com/api/1.0/token',
                headers: 
                    { 
                        'cache-control': 'no-cache',
                        'content-type': 'application/x-www-form-urlencoded' 
                    },
                form: 
                    { 
                        code: codeV,
                        client_id: client_idV,
                        client_secret: client_secretV,
                        grant_type: 'authorization_code',
                        redirect_uri: redirect_uriV 
                    },
                json: true
        };
    
    var rp1 = rp(options).then(function(body){
        reponse = body;
        console.body(body);
    }).catch(function (err){
        console.log("Erreur rp");
    });
    
    
    return reponse;
    
    };

console.log(testConx());