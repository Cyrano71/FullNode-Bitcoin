const {LISTTRANSACTIONFULL} = require("../Constants/constant");
const {LISTNOTFULL} = require("../Constants/constant");
const {NB_TRANSACTION_PER_BLOCK} = require("../Constants/constant");
const {OTHERNODE} = require("../Constants/constant");
const {MYNODE} = require("../Constants/constant");
const {NUMBER_ZERO} = require("../Constants/constant");
const {TIME_PERIOD} = require("../Constants/constant");

const {broadcast} =  require('../MinorMessage/messageNode');
const {findProofMsg} =  require('../MinorMessage/messageNode');
const {checkIntegrityOfBlockChain} = require("../MinorBlockChain/IntegrityBlockChainCreate");

var kill = require('../node_modules/tree-kill');

const { spawn } =  require('child_process');
const { exec } = require('child_process');
const { fork } = require('child_process');

var mutexify = require('../node_modules/mutexify');
var lock = mutexify();

const {clone} = require("./HashTools");

class StatusProcess {

    constructor(listTransaction, emiterMessage, emiterError,
                MyportSocket, ListPortSockets, SocketsPipe,
                DockerChain) {

    	this.listTransaction = listTransaction
    	this.indexList = 0;
    	this.stateList = LISTNOTFULL;

        this.emiterMessage = emiterMessage;
        this.emiterError = emiterError;

        this.MyportSocket = MyportSocket;
        this.ListPortSockets = ListPortSockets;
        this.SocketsPipe = SocketsPipe;

        this.DockerChain = DockerChain;

    	this.proofOfWorkFork = undefined;
        //this.ifForkInBlockChain = false;
        this.ForkInBlockChainIndex = [0];

        this.pool = [];

        this.numberZero = NUMBER_ZERO;
    }

    getNumberZero(){
        return (this.numberZero);
    }

    testTimeStamp(){
        var BlockChain = this.DockerChain[0];
        if (BlockChain.length % 4 == 0){
            var TimeStampLast = BlockChain[BlockChain.length - 1].timestamp;
            var TimeStampFirst = BlockChain[BlockChain.length - 4].timestamp;
            if (TimeStampLast - TimeStampFirst > TIME_PERIOD){
                console.log("The process is too long " + (TimeStampLast - TimeStampFirst));
                /*
                if (this.numberZero > 2){
                    this.numberZero -= 1;
                }
                */
            }
            else if (TimeStampLast - TimeStampFirst < TIME_PERIOD){
                console.log("The process is too quick " + (TimeStampLast - TimeStampFirst));
                //this.numberZero += 1;
            }
            console.log("Current Value For NumberZero : " + this.numberZero);

        }

    }

    replaceLatestBlock(BlockChain, newBlock){
        console.log("We replace our latest block by the new block");
        BlockChain.pop();
        BlockChain.push(newBlock);
    }

    createForkChain(BlockChain, newBlock){
        console.log("Duplicate the BlockChain");
        var ForkBlockChain = [BlockChain[BlockChain.length - 2], newBlock];
        this.DockerChain.push(ForkBlockChain);
        this.setForkInBlockChainIndex(BlockChain.length - 2);
    }

    addBlockToBlockChain(BlockChain, newBlock, status){
        BlockChain.push(newBlock);
        //this.resetList();

        if (status == OTHERNODE){
            console.log("Add the block hash come from othernode : " + newBlock.hash + " with our previous hash : " + newBlock.previousHash); 
        }
        else{
            console.log("I put my myNewBlock in the BlockChain");
            broadcast(this.SocketsPipe, findProofMsg(newBlock));
        }

        checkIntegrityOfBlockChain(this.DockerChain, BlockChain, this);
        this.testTimeStamp();
    }

    addTxnsToPool(txns){
        console.log("Add txns to the pool : " + JSON.stringify(txns));
        this.pool.push(txns);
    }

    poolFull(){
        if (this.pool.length >= 4){
            return true;
        }
        return false;
    }

    listTransactionEmpty(){
        if (this.listTransaction.length == 0){
            return true;
        }
        return false
    }

    canTransferPoolToList(){
        if (this.poolFull() && this.listTransactionEmpty()){
            return true;
        }
        return false;
    }

    transferPoolToListTransaction(){
        console.log("Transfert txns pool To list");
        var trigger = false;
        /*
        console.log("Before");
        console.log(this.listTransaction);
        console.log(this.pool);
        */
        if (this.listTransaction.length == 0){

            var i = 0;

            for (; i < this.pool.length && i < NB_TRANSACTION_PER_BLOCK; i++){
                this.listTransaction.push(this.pool[i]);
                trigger = true;
            }

            if (trigger){
                //console.log(i);
                for (var j = 0; j < i; j++){
                    /*
                    Be aware it is splice not slice!!!!
                    */
                    this.pool.splice(0, 1);
                }
            }
        }
        /*
        console.log("After");
        console.log(this.listTransaction);
        console.log(this.pool);
        */
    }

    getDocker(){
        return this.DockerChain;
    }

    getListSocketsPipe(){
        return this.SocketsPipe;
    }

    addPortSocket(port){
        this.ListPortSockets.push(port);
    }

    thePortIsAlreadyInList(port){
        if (this.ListPortSockets.indexOf(port) != -1){
            return true;
        }
        if (port == this.MyportSocket){
            return true;
        }
        return false;
    }

    getListPortSocket(){
        return this.ListPortSockets
    }

    getMyPortSocket(){
        return this.MyportSocket;
    }

    launchEventSocketHandler(ws){
        this.emiterMessage.emit('initMessageHandler', ws);
        this.emiterError.emit('initErrorHandler', ws);
        /*
        EventInitMessageHandler.emit('initMessageHandler', ws);
        EventInitErrorHandler.emit('initErrorHandler', ws);
        */
    }

   

    resetIndexForkInBlockChain(number_of_blockchain){
        this.ForkInBlockChainIndex.slice(number_of_blockchain);
    }

    setForkInBlockChainIndex(index){
        this.ForkInBlockChainIndex.push(index); 
    }

    getIndexForInBlockChain(number_of_blockchain){
        return (this.ForkInBlockChainIndex[number_of_blockchain]);
    }

    killProcessFork(){
        if (this.proofOfWorkFork != undefined){
            var pidProcess = this.proofOfWorkFork.pid;
            //var stateProcess = this;

            kill(pidProcess, 'SIGKILL', function(err) {
                console.log("Process PID " + pidProcess + " died");
                //stateProcess.resetProofOfWorkForkVar(); 
                //console.log(`${stdout}`); 
            });
            this.proofOfWorkFork = undefined;
            this.listTransaction = [];
        }

        /*
        exec('kill -9 ' + pidProcess  , (err, stdout, stderr) => {
            
            if (err) { 
                console.error(`exec error: ${err}`);
                return; 
            }
            console.log("Process PID " + pidProcess.toString() + " died");
            //console.log(`${stdout}`);
            stateProcess.resetProofOfWorkForkVar();  
        });
        */

    }

    initProofOfWorkFork(){
    	this.proofOfWorkFork = fork('./ProofOfWork/proofOfWork.js');
        return this.proofOfWorkFork;
    }

    setProofOfWorkFork(proofOfWork){
        this.proofOfWorkFork = proofOfWork;
    }

    resetProofOfWorkForkVar(){
    	this.setProofOfWorkFork(undefined);
    }

    addTxnsInList(txns){
        //txns = txns.replace(/\\"/g, '"');
        //console.log(txns);
        //txns = JSON.parse(txns);
        //JSON.stringify(stateProcess.getListTransaction())
        //console.log("We add the txns to the list : " + JSON.stringify(txns));
    	this.listTransaction.push(txns);
        /*
    	this.incrementIndexList();
    	if (this.getLengthList() == NB_TRANSACTION_PER_BLOCK){
    		this.stateList = LISTTRANSACTIONFULL;
    	}*/
    }

    getProofOfWorkFork(){
        return this.proofOfWorkFork;
    }

    getListTransaction(){
    	return clone(this.listTransaction);
    }

    resetList(){
    	this.listTransaction = [];
    }

    getLengthList(){
    	return (this.listTransaction.length);
    }

    resetListAndProofOfWorkForkVar(){
        //this.setWhoOwnTheBlock(MYNODE);
        //this.setMyNewBlock(undefined);
        //console.log("Reset List and Proof Of Work");
        //this.resetIndexList();
        //this.stateList = LISTNOTFULL;
        console.log("Clean the list and the var proofOfWorkFork");
        this.resetList();
        this.resetProofOfWorkForkVar();
    }

    /*
     ifForkInBlockChain(){
        return this.ifForkInBlockChain;
    }
     getIndexList(){
        return this.indexList;
    }

    incrementIndexList(){
        this.indexList = this.indexList + 1;
    }

    resetIndexList(){
        this.indexList = 0;
    }

    getStateList(){
        return this.stateList;
    }

    getMyNewBlock(){
    	return this.myNewBlock;
    }

    setMyNewBlock(myNewBlock){
    	this.myNewBlock = myNewBlock;
    }
    */

    /*
    whoOwnTheBlock(){
        return this.owner;
    }

    setWhoOwnTheBlock(newOwner){
        this.owner = newOwner;
    }*/

    /*
    setifForkInBlockChain(bool){
        this.ifForkInBlockChain = bool;
    }
    */
}

exports.StatusProcess = StatusProcess;