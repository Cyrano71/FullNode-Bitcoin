var request = require('../node_modules/request');
var express = require("../node_modules/express");

function callback(error, response, body) {
  console.log("\n---------RESPONSE----------")
  if (error != null)
    console.log(error);
  console.log(body);
  //console.log(body);
  if (!error && response.statusCode == 200) {
  }
}

var sleep = (miliseconds) => {
        var currentTime = new Date().getTime();
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
};

var sendRequestToMinorNode = (nameClient) => {
    var MinorNodeAdress = [6001, 6003, 6005];

    for (var i = 0; i < MinorNodeAdress.length; i++){
         var options = {
            url: 'http://localhost:' + MinorNodeAdress[i] + "/MoneyCLient",
            method: 'GET',
            headers: {
              'Content-type' : 'application/json'
            },
            body: JSON.stringify(nameClient)
        };

        console.log(options);
        request(options, callback);
        sleep(1000);
    }
}

var nameClient = {"NameClient" : [ '74902224488826910232085002394257988863306420152538940914508498959529124263155',
        '54735445204747581055487271024388007249667670763554945030637103963531009463654' ]}
sendRequestToMinorNode(nameClient);