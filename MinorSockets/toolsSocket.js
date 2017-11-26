var CryptoJS = require("../node_modules/crypto-js");

const {queryChainLengthMsg} = require('../MinorMessage/messageNode');
const {queryAllMsg} =  require('../MinorMessage/messageNode');
const {responseChainMsg} =  require('../MinorMessage/messageNode');
const {responseLatestMsg} =  require('../MinorMessage/messageNode');
const {findProofMsg} =  require('../MinorMessage/messageNode');
const {write} =  require('../MinorMessage/messageNode');
const {broadcast} =  require('../MinorMessage/messageNode');
const {parseMessage} = require('../MinorMessage/messageNode');

var MessageType = require("../Constants/constant");
const {FIRST_BLOCKCHAIN} = require("../Constants/constant");

const {generateNextBlock} = require("../MinorBlock/ClassBlock");
const {getGenesisBlock} = require("../MinorBlock/ClassBlock");
const {getLatestBlock} = require("../MinorBlock/ClassBlock");

const {isValidNewBlock} = require("../MinorBlock/BlockTools");
const {checkSameIndexBlock} = require("../MinorBlock/BlockTools");
const {processBlockFromOtherNode} = require("../MinorBlock/BlockTools");

const {OneChainIsmoreLonger} = require("../MinorBlockChain/ForkChainTools");

const {replaceChain} = require("../MinorBlockChain/CheckValidChainReceive");
const {isValidChain} = require("../MinorBlockChain/CheckValidChainReceive");

const {initConnection} = require("../MinorSockets/SocketInit");
const {connectToPeers} = require("../MinorSockets/SocketInit");

/*
//const {checkIntegrityOfBlockChain} = require("../MinorBlockChain/BlockChainTools");
var kill = require('../node_modules/tree-kill');

const { spawn } =  require('child_process');
const { exec } = require('child_process');
const { fork } = require('child_process');

const {calculateHashForBlock} = require("../MinorBlock/HashTools");
const {getZero} = require("../MinorBlock/HashTools");

const {OTHERNODE} = require("../Constants/constant");
const {MYNODE} = require("../Constants/constant"); 
const {LISTTRANSACTIONFULL} = require("../Constants/constant"); 
const {LISTNOTFULL} = require("../Constants/constant"); 
const {NB_TRANSACTION_PER_BLOCK} = require("../Constants/constant"); 
const {SAME_INDEX_AND_MORE_RECENT} = require("../Constants/constant"); 
const {SAME_INDEX_AND_TIMESTAMP} = require("../Constants/constant"); 
const {BLOCK_TRUE_AND_DIFFERENT_INDEX} = require("../Constants/constant");
const {BLOCK_FALSE} = require("../Constants/constant");

var mutexify = require('../node_modules/mutexify');
var lock = mutexify();

*/

var processMessage = (ws, message, stateProcess) => {
    DockerChain = stateProcess.getDocker();
    sockets = stateProcess.getListSocketsPipe();
	switch (message.type) {
		case MessageType.QUERY_LATEST:
			write(ws, responseLatestMsg(DockerChain[0]));
			break;
		case MessageType.QUERY_ALL:
			write(ws, responseChainMsg(DockerChain[0]));
			break;
		case MessageType.RESPONSE_BLOCKCHAIN:
			handleBlockchainResponse(message, stateProcess);
			break;
        case MessageType.PEERS:
            handleConnectionPeers(message, stateProcess);
            break;
        case MessageType.SEND_MY_PORT:
            handlePort(message, stateProcess);
            break ;
		case MessageType.FIND_PROOF :
            handleFindProof(message, stateProcess);
		break ;
	}
}

var handleFindProof = (message, stateProcess) => {
    var DockerChain = stateProcess.getDocker();
    var newBlock = parseMessage(message);

    if (DockerChain.length > 1){
        for(var numberOfBlockChain = 0; numberOfBlockChain < DockerChain.length; numberOfBlockChain++) {
            console.log("Try the BlockChain " + (numberOfBlockChain + 1).toString() + " of the Fork");
            processBlockFromOtherNode(newBlock, stateProcess, numberOfBlockChain);
        }
        OneChainIsmoreLonger(stateProcess, DockerChain);
    }
    else{
        processBlockFromOtherNode(newBlock, stateProcess, FIRST_BLOCKCHAIN);
    }
}

var handlePort = (message, stateProcess) => {
    //console.log(message);
    message = message.data.replace(/\\"/g, '"');
    if (stateProcess.thePortIsAlreadyInList(message) == false){
        console.log("I receive a port : " + message);
        stateProcess.addPortSocket(message);
    }
}

var handleConnectionPeers = (message, stateProcess) => {
    var sockets = stateProcess.getListSocketsPipe();
    var message = message.data.replace(/\\"/g, '"');
    var listPeer = JSON.parse(message);
    var NewListPeer = [];
    var indexRemove = [];
    var prepend = "ws://localhost:";

    for (var i = 0; i < listPeer.length; i++){
        if (stateProcess.thePortIsAlreadyInList(listPeer[i]) == true){
            indexRemove.push(i);
        }
        else{
            stateProcess.addPortSocket(listPeer[i]);
            listPeer[i] =  "".concat(prepend,listPeer[i]);
            NewListPeer.push(listPeer[i]);
        }
    }

    if (NewListPeer.length != 0){
        console.log("Receive news Port Sockets");
        console.log(NewListPeer);
        connectToPeers(NewListPeer, stateProcess);
    }
}

var handleBlockchainResponse = (message, stateProcess) => {
    var sockets = stateProcess.getListSocketsPipe();
    var DockerChain = stateProcess.getDocker();
	var BlockChain = DockerChain[0];

	message.data = message.data.replace(/\\"/g, '"');
    var receivedBlocks = JSON.parse(message.data).sort((b1, b2) => (b1.index - b2.index));
    var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    var latestBlockHeld = getLatestBlock(BlockChain);

    if (latestBlockReceived.index > latestBlockHeld.index) {

        console.log('blockchain possibly behind. We got: ' + latestBlockHeld.index + ' Peer got: ' + latestBlockReceived.index);

        if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
        	
            if (isValidNewBlock(latestBlockReceived, latestBlockHeld, stateProcess.getNumberZero())){
            	console.log("We can append the received block to our chain");
            	BlockChain.push(latestBlockReceived);
            	broadcast(sockets, responseLatestMsg(BlockChain));
            }
            else {
                console.log("The block is no valid => remove");
            }

        } else if (receivedBlocks.length === 1) {
            
            console.log("We have to query the chain from our peer");
            broadcast(sockets, queryAllMsg());

        } else {

            console.log("Received blockchain is longer than current blockchain");
            replaceChain(receivedBlocks, DockerChain, sockets, stateProcess.getNumberZero());

        }
        
    } else {

        console.log('received blockchain is not longer than received blockchain. Do nothing');

    }
};


exports.handleBlockchainResponse = handleBlockchainResponse;
exports.processMessage = processMessage;

/*
        console.log(typeof (newBlock.txns));
        console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
        console.log(newBlock.index);
        console.log(newBlock.previousHash);
        console.log(newBlock.timestamp);
        console.log(newBlock.txns);
        console.log(newBlock.txns[0]["3bc"]);
        console.log(newBlock.txns[0]["cd9"])
*/

/*
 else if (stateProcess.getStateList() == LISTTRANSACTIONFULL){
        if (globalState == MYNODE && myNewBlock != undefined) {
                console.log("Send a message to all");
                console.log("Add the block hash for me : " + myNewBlock.hash.substring(0,3) + " with previous hash : " + myNewBlock.previousHash.substring(0,3) + " proof : " + proof);
                blockchain.push(myNewBlock);
                
                // console.log(myNewBlock);
                listTransaction = [];
                myNewBlock = undefined;
            }
        
*/



/*
stateProcess.whoOwnTheBlock() == OTHERNODE && 
*/

// console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
 //console.log("Add the block hash come from othernode : " + newBlock.hash.substring(0,3) + " with previous hash : " + newBlock.previousHash.substring(0,3));
                //console.log(`${stdout}`); 
//stateProcess.setWhoOwnTheBlock(OTHERNODE);

 /*
     //console.log(listPeer[i].substring(7));
        //listPeer[i] = listPeer[i].substring(7);
    for (var i = 0; i < sockets.length; i++){
        var index = -1;
        if ((index = listPeer.indexOf(sockets[i])) != -1){
            listPeer.slice(index, 1);
        }
    }*/