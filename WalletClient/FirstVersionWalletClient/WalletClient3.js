var express = require("../node_modules/express");
var bodyParser = require('../node_modules/body-parser');
var WebSocket = require("../node_modules/ws");
var request = require('../node_modules/request');

http_port = 6003;
p2p_port = 3003;

var initHttpServer = () => {
    var app = express();
    app.use(bodyParser.json());

    app.get('/blocks', (req, res) => {})
    app.get('/peers', (req, res) => {})
    app.post('/addPeer', (req, res) => {});
    app.post('/addTransaction', (req, res) => {
    });
    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
};

var initP2PServer = () => {
    var server = new WebSocket.Server({port: p2p_port});
    server.on('connection', ws => initConnection(ws));
    console.log('listening websocket p2p port on: ' + p2p_port);
};

sockets = [];

answerUser = 1;

var initConnection = (ws) => {
    console.log("New connection");
    sockets.push(ws);

    if (answerUser == 1){
        ws.send(JSON.stringify({ type: 3,
         data: '{"block" : {"index":1,\
        "previousHash":"eb5144a7fca22dd1a21d7dfdb0a7018df6ce02373e86fab9d4b4729a9b7da65c","timestamp":1507372929,"nonce":107,"txnCount":1,"txns":[{"3bc":9,"cd9":-9}],"state":{"3bc":50,"cd9":50},\
         "hash":"822a5ddd0844bcaff40ffde6544492e3f335fec95e2dd2963cbb5d05cd334bc5"}}' }));
    }
    else if (answerUser == 2){
         ws.send(JSON.stringify({ type: 3,
         data: '{"block" : {"index":2,\
        "previousHash":"822a5ddd0844bcaff40ffde6544492e3f335fec95e2dd2963cbb5d05cd334bc5","timestamp":1507372939,"nonce":1287,"txnCount":1,"txns":[{"3bc":3,"cd9":-3}],"state":{"3bc":50,"cd9":50},\
         "hash":"833650b2f134e3df8d78293b5b2585644617eb6555166f24c31587dcf1f5712d"}}' }));
    }

    /*
    if (answerUser == 1){
        ws.send(JSON.stringify({ type: 3,
         data: '{"block" : {"index":1,\
        "previousHash":"4001c3ae567b0f8002d10d627a6295002084016de33db5f32bd70f43330202de","timestamp":1507234186.921,"nonce":10196,"txnCount":1,"txns":[{"3bc":7,"cd9":-7}],"state":{"3bc":50,"cd9":50},\
         "hash":"777c04182c0090cd7ff450169ff52d4a10917cca6f1af84353da6031bbfb516c"}}' }));
    }
    else if (answerUser == 2){
         ws.send(JSON.stringify({ type: 3,
         data: '{"block" : {"index":2,\
        "previousHash":"777c04182c0090cd7ff450169ff52d4a10917cca6f1af84353da6031bbfb516c","timestamp":1507234188,"nonce":877,"txnCount":1,"txns":[{"3bc":8,"cd9":-8}],"state":{"3bc":65,"cd9":35},\
         "hash":"ab2b206ea2a7301972e62d59c3cbe6c053bcd2637c6df92d83ed137f592eced7"}}' }));
    }
    else if (answerUser == 3){
         ws.send(JSON.stringify({ type: 3,
         data: '{"block" : {"index":2,\
        "previousHash":"7a6283bc7ea2c93abde9b8cd9552b9cc7c01f496a33fcaa911169b57fa3e71a0","timestamp":1507234220,"nonce":1820,"txnCount":1,"txns":[{"3bc":9,"cd9":-9}],"state":{"3bc":65,"cd9":35},\
         "hash":"131c7acac3bbcacff6099b81ad14b72912a8eb2b7095c7f6a9f9879936eaa730"}}' }));
    }
    else if (answerUser == 3){
         ws.send(JSON.stringify({ type: 3,
         data: '{"block" : {"index":2,\
        "previousHash":"7a6283bc7ea2c93abde9b8cd9552b9cc7c01f496a33fcaa911169b57fa3e71a0","timestamp":1507234220,"nonce":1820,"txnCount":1,"txns":[{"3bc":9,"cd9":-9}],"state":{"3bc":65,"cd9":35},\
         "hash":"131c7acac3bbcacff6099b81ad14b72912a8eb2b7095c7f6a9f9879936eaa730"}}' }));
    }
    */

//,{"3bc":5,"cd9":-5},{"3bc":5,"cd9":-5},{"3bc":5,"cd9":-5}],
/* 
You can use a Message Handler and Error :
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
*/

};

initHttpServer();
initP2PServer();

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
    /*
    var info = JSON.parse(body);
    console.log(info.stargazers_count + " Stars");
    console.log(info.forks_count + " Forks");
    */
  }
}



var ws = new WebSocket("ws://localhost:3001");
ws.on('open', () => initConnection(ws));
        ws.on('error', (err) => {
            console.log('connection failed' + err)
        });


/*
ws.send(JSON.stringify({ type: 3,
      data: '[{"index":1,"previousHash":"4001c3ae567b0f8002d10d627a6295002084016de33db5f32bd70f43330202de","timestamp":1507232389.521,"nonce":443,"txnCount":4,"txns":[{"3bc":5,"cd9":-5},{"3bc":5,"cd9":-5},{"3bc":5,"cd9":-5},{"3bc":5,"cd9":-5}],"state":{"3bc":65,"cd9":35},"hash":"7a6283bc7ea2c93abde9b8cd9552b9cc7c01f496a33fcaa911169b57fa3e71a0"}]'}),
        function(error) {}
);*/


    //function(error) {
    //        console.log(error);
    // Do something in here here to clean things up (or don't do anything at all)

/*
var nbTxnsSend = 4;
while (nbTxnsSend){
  var options = {
    url: 'http://localhost:6001/addTxns',
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify({txns : {"3bc" : 5, "cd9" : -5}})
  };

  //console.log("send request addTxns via http request to server 6001");
  console.log(options);
  request(options, callback);


  var options = {
    url: 'http://localhost:6003/addTxns',
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify({txns : {"3bc" : 5, "cd9" : -5}})
  };

  //console.log("send request addTxns via http request to server 6003");
  console.log(options);
  request(options, callback);
  

  nbTxnsSend--;

  //sleep(3000);
}*/