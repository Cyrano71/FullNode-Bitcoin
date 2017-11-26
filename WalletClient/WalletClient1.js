var request = require('../node_modules/request');
var express = require("../node_modules/express");
const {createNewTxns} = require("./ExampleTxns.js");
const {createNewTxns2} = require("./ExampleTxns.js");
const {createNewTxns3} = require("./ExampleTxns.js");
const {createNewTxns4} = require("./ExampleTxns.js");

function callback(error, response, body) {
  //console.log(error);
  //console.log(response);
  //console.log(body);
  if (!error && response.statusCode == 200) {
  }
}

var sleep = (miliseconds) => {
        var currentTime = new Date().getTime();
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
};

var sendRequestToMinorNode = (dictTx) => {
    var MinorNodeAdress = [6001, 6003, 6005];

    for (var i = 0; i < MinorNodeAdress.length; i++){
         var options = {
            url: 'http://localhost:' + MinorNodeAdress[i] + '/addTxns',
            method: 'POST',
            headers: {
              'Content-type' : 'application/json'
            },
            body: JSON.stringify(dictTx)
        };

        console.log(options);
        request(options, callback);
        sleep(1000);
    }
}

var myArgs = process.argv.slice(2);

if (myArgs[0] == '1')
  sendRequestToMinorNode(createNewTxns());
else if (myArgs[0] == '2')
  sendRequestToMinorNode(createNewTxns2());
else if (myArgs[0] == '3')
  sendRequestToMinorNode(createNewTxns3());
else if (myArgs[0] == '4')
  sendRequestToMinorNode(createNewTxns4());
else
  console.log("Error no arg");