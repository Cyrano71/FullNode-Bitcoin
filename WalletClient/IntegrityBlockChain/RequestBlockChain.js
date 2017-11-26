var request = require('../../node_modules/request');
var express = require("../../node_modules/express");

//console.log('END OF THE TRANSACTIONS');
console.log('-------INTEGRITY OF THE BLOCCHAIN--------');
console.log('-------REQUEST BLOCKCHAIN----------------');

var sleep = (miliseconds) => {
        var currentTime = new Date().getTime();
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
};

function callback(error, response, body) {
  if (error != null)
    console.log(error);
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
}

var sendRequestToMinorNode = () => {
    var MinorNodeAdress = [6001, 6003, 6005];

    for (var i = 0; i < MinorNodeAdress.length; i++){
         var options = {
            url: 'http://localhost:' + MinorNodeAdress[i] + '/Blocks',
            method: 'GET',
            headers: {
              'Content-type' : 'application/json'
            }
          };

        console.log(options);
        request(options, callback);

        sleep(1000);
    }
}

sendRequestToMinorNode();

/*
var options = {
    url: 'http://localhost:6001/Blocks',
    method: 'GET',
  };

//console.log("send request addTxns via http request to server 6001");
console.log(options);
request(options, callback);

var options = {
    url: 'http://localhost:6003/Blocks',
    method: 'GET',
  };

//console.log("send request addTxns via http request to server 6003");
console.log(options);
request(options, callback);

var options = {
    url: 'http://localhost:6001/Blocks',
    method: 'GET',
  };

//console.log("send request addTxns via http request to server 6001");
console.log(options);
request(options, callback);
*/
