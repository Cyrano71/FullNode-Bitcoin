var request = require('request');
var express = require("../node_modules/express");

var sleep = (miliseconds) => {
        var currentTime = new Date().getTime();
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
};

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

var nbTxnsSend = 4;
while (nbTxnsSend){
  var options = {
    url: 'http://localhost:6001/addTxns',
    method: 'POST',
    headers: {
      'Content-type' : 'application/json'
    },
    body: JSON.stringify({txns : {"3bc" : -5, "cd9" : 5}})
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
    body: JSON.stringify({txns : {"3bc" : -5, "cd9" : 5}})
  };

  //console.log("send request addTxns via http request to server 6003");
  console.log(options);
  request(options, callback);

  nbTxnsSend--;

  sleep(1500);
}


/*
var express = require("../node_modules/express");
var bodyParser = require('../node_modules/body-parser');
var WebSocket = require("../node_modules/ws");

http_port = 6006;
p2p_port = 3012;

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

initHttpServer();
initP2PServer();
*/