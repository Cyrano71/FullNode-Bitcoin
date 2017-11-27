var CryptoJS = require("crypto-js");
var express = require("express");

const {getGenesisBlock} = require("./MinerBlock/ClassBlock");

/*
We can't change a object by reference in node js
You can't do that Blockchain = NewBlockchain
So we need a docker to save the BlockChain.
When we will want to replace the actual BlockChain
we just have to do that DockerChain[0] = NewBlockChain
*/

var BlockChain = [];
var DockerChain = [BlockChain]; 
var Origin = getGenesisBlock(BlockChain);
BlockChain.push(Origin);

const { initApp } = require("./MinerHttpServer/toolsHttpServer");
const { writeBlockChains } = require("./MinerHttpServer/toolsHttpServer");
const {writeDocker} = require("./MinerHttpServer/toolsHttpServer");
const { addPeer } = require("./MinerHttpServer/toolsHttpServer");
const {addTxns} = require("./MinerHttpServer/toolsHttpServer");
const {writePortSockets} = require("./MinerHttpServer/toolsHttpServer");
const {gatherMoneyClient} = require("./MinerHttpServer/toolsHttpServer");
/*
If you want to create a other node, you have just to change the declaration below
create a file settingServer3 in MinorHttpServer
*/

var constSetting = require("./MinerHttpServer/settingServer3");
const {initialPeersSockets} = require("./MinerHttpServer/settingServer3");

/*
Use the socket technologie because It is more efficient to exchange infomation
between the Peers
*/

var WebSocket = require("ws");
const {initConnection} = require("./MinerSockets/SocketInit");
const {connectToPeers} = require("./MinerSockets/SocketInit");
const {processMessage} = require("./MinerSockets/toolsSocket");

/*
We need to create a Event Emitter because initConnection of the Socket is
in SocketInit and InitMessageHandler is in this file.
Or we need to keep InitMessageHandler in this file (Minor1.js) because it needs to be
feeding by the var BlockChain, Docker etc... Or these var are in this file.
So we create a EventEmiter in this file we send this event in SocketInit and
in Socket Init the function initConnection will launch a emitEvent
*/

var EventEmitter = require('events').EventEmitter;
var EventInitMessageHandler = new EventEmitter();
var EventInitErrorHandler = new EventEmitter();

var initMessageHandler = (ws) => {
    ws.on('message', (data) => {
        processMessage(ws, JSON.parse(data), stateProcess);
    });
};

var initErrorHandler = (ws) => {
    var closeConnection = (ws) => {
        console.log('connection failed to peer: ' + ws.url);
        sockets.splice(sockets.indexOf(ws), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};

EventInitMessageHandler.on('initMessageHandler', initMessageHandler);
EventInitErrorHandler.on('initErrorHandler', initErrorHandler);

/*
Use StateProcess for the coordination between our process which does the proof
of Work and the other process which send their proofOfWork when they finish.
The stateProcess Obct allow us to kill our current process which does the proof 
of work and update our BlockChain
*/

var Process = require("./MinerBlock/ClassStatusProcess");

var sockets = [];
var portSockets = [];
/* 
You can also use httpPort to save the port of the other peers
because by default it is only the port socket wich is save
var httpPort = {};
*/

var listTransaction = [];

var stateProcess = new Process.StatusProcess(listTransaction,
                                            EventInitMessageHandler, EventInitErrorHandler,
                                            constSetting.p2p_port,portSockets, 
                                            sockets,
                                            DockerChain);

/*
Same thing that for Socket Init. We need to keep initHttpServer in this file
because this function needs to be feeding with variables Docker, BlockChain etc..
*/

var initHttpServer = (httpPort) => {
    app = initApp();

    app.get("/MoneyCLient", (req, res) => {
       gatherMoneyClient(res, stateProcess.getDocker()[0], req.body.NameClient)
    });
    app.get("/PortSockets", (req, res) =>{
        writePortSockets(res, stateProcess.getListPortSocket());
    });
    app.get('/Docker', (req, res) => {
        writeDocker(res, stateProcess.getDocker());
    });
    app.get('/blocks', (req, res) => {
       writeBlockChains(res, stateProcess.getDocker(), constSetting.p2p_port);
    });
    app.get('/peers', (req, res) => {
        res.send(sockets.map(s => s._socket.remoteAddress + ':'  + s._socket.remotePort));
    });
    app.post('/addPeer', (req, res) => {
        addPeer(req, res);
        connectToPeers([req.body.peer], stateProcess);
    });
    app.post('/addTxns', (req, res) => {
        addTxns(req, stateProcess);
    });
    app.listen(httpPort, () => console.log('Listening http on port: ' + httpPort));
};

var initP2PServer = () => {
    p2pPort = constSetting.p2p_port;
    var server = new WebSocket.Server({port : p2pPort});
    server.on('connection', ws => 
                initConnection(ws, stateProcess));
    console.log('listening websocket p2p port on: ' + p2pPort);
};

initHttpServer(constSetting.http_port);
initP2PServer();

if (initialPeersSockets.length != 0){
    connectToPeers(initialPeersSockets, stateProcess);
}

/*
var ClassMinor = require("./MinerBlock/ClassBlock");
var tools = require("./MinerBlock/HashTools");
var toolsHttp = require("./MinerHttpServer/toolsHttpServer");
*/

/*
const {OTHERNODE} = require("./Constants/constant");
const {MYNODE} = require("./Constants/constant");
*/




//var MessageType = require("./Constants/constant.js");
