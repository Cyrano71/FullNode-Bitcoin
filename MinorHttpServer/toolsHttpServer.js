var express = require("../node_modules/express");
var bodyParser = require('../node_modules/body-parser');
var tools = require("../MinorBlock/HashTools");
var Constants = require("../Constants/constant");
var constSetting = require("./settingServer");
const {processMyBlock} = require("../MinorBlock/BlockTools");
const {printBlockChain} = require("../MinorBlockChain/printBlockChain");
const {gatherMoneyInBlockChain} = require("../MinorTxns/checkTxns");
const {MONEY_AND_NAME} = require("../Constants/constant");

var initApp = () => {
	var app = express();
    app.use(bodyParser.json());
    return app;
};

var gatherMoneyClient = (res, BlockChain, NameClient) => {
    res.write(JSON.stringify(gatherMoneyInBlockChain(BlockChain, [NameClient], MONEY_AND_NAME)));
    res.end();
}

var writeDocker = (res, Docker) => {
    res.write(JSON.stringify(Docker));
    res.end();
}

var writePortSockets = (res, PortSockets) => {
    res.write(JSON.stringify(PortSockets));
    res.end();
}

var writeBlockChains = (res, Docker, p2p_port) => {
    BlockChain = Docker[0];
    var strResponse = printBlockChain(BlockChain, p2p_port);
    res.write(strResponse);
 	//res.write(JSON.stringify(BlockChain));
	//res.write(" hash total : " + tools.calculateHashForBlockChain(BlockChain))
	res.end()
};

var addPeer = (req, res) => {
	console.log("add peer socket : " + JSON.stringify(req.body.peer) + 
                " http_port : " + JSON.stringify(req.body.http));
	res.send();
};

var addTxns = (req, stateProcess) => {
 	if (stateProcess.getLengthList() < Constants.NB_TRANSACTION_PER_BLOCK) {
        if (stateProcess.canTransferPoolToList()){
            stateProcess.transferPoolToListTransaction();
        }
        else{
            stateProcess.addTxnsInList(req.body);
        }
        if (stateProcess.getLengthList() == Constants.NB_TRANSACTION_PER_BLOCK){
            processMyBlock(stateProcess);
        }       
    }
    else {
        stateProcess.addTxnsToPool(req.body.txns);
        //console.log("The list Transaction is full try more later");
    }
}

exports.gatherMoneyClient = gatherMoneyClient;
exports.writePortSockets = writePortSockets;
exports.writeDocker = writeDocker;
exports.addTxns = addTxns;
exports.initApp = initApp;
exports.addPeer = addPeer;
exports.writeBlockChains = writeBlockChains;

//AddTransactionBlockEvent.emit('ListTransactonFull', null, null, Constants.LISTTRANSACTIONFULL)
