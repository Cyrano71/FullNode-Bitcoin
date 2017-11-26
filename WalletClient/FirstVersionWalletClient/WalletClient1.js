var request = require('../node_modules/request');
var express = require("../node_modules/express");
var CryptoJS = require("../node_modules/crypto-js");
 
keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,3);
keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,3);

var sleep = (miliseconds) => {
        var currentTime = new Date().getTime();
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
};

function callback(error, response, body) {
  console.log(error);
  console.log(response);
  console.log(body);
  if (!error && response.statusCode == 200) {
    
    /*
    var info = JSON.parse(body);
    console.log(info.stargazers_count + " Stars");
    console.log(info.forks_count + " Forks");
    */
  }
}

var makeTransaction = (keyAlice, keyBob, maxValue=3) => {
    // This will create valid transactions in the range of (1,maxValue)
    var sign      =  Math.round(((Math.random()) * 2 - 1));   // This will randomly choose -1 or 1
    var amount    = Math.round(((Math.random()) * (maxValue - 1)  + 1));
    var alicePays = sign * amount;
    var bobPays   = -1 * alicePays;
    var DictTransaction = {};
    DictTransaction[keyAlice] = alicePays;
    DictTransaction[keyBob] = bobPays;
    // By construction, this will always return transactions that respect the conservation of tokens.
    // However, note that we have not done anything to check whether these overdraft an account
    return DictTransaction;
};

var NUMBER_TRANSACTION = 30;
var txns = [];
txns.push({"3bc": -2,"cd9":0});

for(var i=0; i < NUMBER_TRANSACTION; i++){
  txns.push(makeTransaction(keypublic1, keypublic2));
}


/* 
Use this url to contact Windows computer 
url: 'http://192.168.1.146:6001/'
*/

var nbTxnsSend = 0;
while (nbTxnsSend < 4){

  tx = txns[nbTxnsSend];
  dictTx = {};
  dictTx["txns"] = tx;
  //console.log(dictTx);
  
  var options = {
    url: 'http://localhost:6001/addTxns',
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(dictTx)
  };


  //{txns : {"3bc" : 5, "cd9" : -5}}
  //console.log("send request addTxns via http request to server 6001");
  console.log(options);
  request(options, callback);

  /*
  var options = {
    url: 'http://localhost:6003/addTxns',
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(dictTx)
  };

  //{ txns: { '3bc': -2, cd9: 0 } }
  //{txns : {"3bc" : 5, "cd9" : -5}}
  //console.log("send request addTxns via http request to server 6003");
  console.log(options);
  request(options, callback);

  var options = {
    url: 'http://localhost:6005/addTxns',
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(dictTx)
  };

  //{txns : {"3bc" : 5, "cd9" : -5}}
  //console.log("send request addTxns via http request to server 6001");
  console.log(options);
  request(options, callback);
  
  nbTxnsSend++;

  sleep(1500);

   tx = txns[nbTxnsSend];
  dictTx = {};
  dictTx["txns"] = tx;
  //console.log(dictTx);
  
  var options = {
    url: 'http://localhost:6005/addTxns',
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(dictTx)
  };

  //{txns : {"3bc" : 5, "cd9" : -5}}
  //console.log("send request addTxns via http request to server 6001");
  console.log(options);
  request(options, callback);

  var options = {
    url: 'http://localhost:6003/addTxns',
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(dictTx)
  };

  //{ txns: { '3bc': -2, cd9: 0 } }
  //{txns : {"3bc" : 5, "cd9" : -5}}
  //console.log("send request addTxns via http request to server 6003");
  console.log(options);
  request(options, callback);

  var options = {
    url: 'http://localhost:6001/addTxns',
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify(dictTx)
  };

  //{txns : {"3bc" : 5, "cd9" : -5}}
  //console.log("send request addTxns via http request to server 6001");
  console.log(options);
  request(options, callback);

  */
  
  nbTxnsSend++;

  sleep(1500);
}