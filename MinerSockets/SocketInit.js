const {write} = require("../MinerMessage/messageNode");
const {queryChainLengthMsg} = require("../MinerMessage/messageNode");
const {sendPeers} = require("../MinerMessage/messageNode");
const {sendMyPortSocket} = require("../MinerMessage/messageNode");
var WebSocket = require("ws");

var initConnection = (ws, stateProcess) => {
	stateProcess.launchEventSocketHandler(ws);
	write(ws, sendMyPortSocket(stateProcess.getMyPortSocket()));
    write(ws, queryChainLengthMsg());
    listPorts = stateProcess.getListPortSocket();
    //sockets.map(s => s._socket.remoteAddress + ':'  + s._socket.remotePort);
    if (listPorts.length != 0){
    	console.log("The list of Peer are : ");
    	console.log(listPorts);
    	write(ws, sendPeers(listPorts));
    }
    stateProcess.getListSocketsPipe().push(ws);
};

var connectToPeers = (newPeers, stateProcess) => {
    newPeers.forEach((peer) => {
        var ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws, stateProcess));
        ws.on('error', (err) => {
            console.log('connection failed' + err)
        });
        //httpPort[ws.url.split(':')[2]] = newHttpPeer;
    });
};

exports.initConnection = initConnection;
exports.connectToPeers = connectToPeers;



//var connectToPeers = (newPeers, newHttpPeer) => {
//exports.initErrorHandler = initErrorHandler;

/*
const {write} = require("./MinerMessage/messageNode");
const {queryChainLengthMsg} = require("./MinerMessage/messageNode");

var initConnection = (ws) => {
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    write(ws, queryChainLengthMsg());
    write(ws, sendPeers(sockets));
};
*/

// console.log('Received message' + JSON.stringify(message));

   //initMessageHandler(ws);
    //initErrorHandler(ws);
    /*if (sockets.length != 0){
    	list = sockets.map(s => s._socket.remoteAddress + ':'  + s._socket.remotePort);
    	console.log("The list of Peer are : ");
    	console.log(list);
    	write(ws, sendPeers(list));
    }*/