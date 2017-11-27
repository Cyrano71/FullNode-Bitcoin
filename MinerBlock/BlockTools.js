
var CryptoJS = require("../node_modules/crypto-js");

const {calculateHashForBlock} = require("./HashTools");
const {getZero} = require("./HashTools");

const {SAME_INDEX_AND_MORE_RECENT} = require("../Constants/constant"); 
const {SAME_INDEX_AND_TIMESTAMP} = require("../Constants/constant"); 
const {BLOCK_TRUE_AND_DIFFERENT_INDEX} = require("../Constants/constant");
const {BLOCK_FALSE} = require("../Constants/constant");
const {OTHERNODE} = require("../Constants/constant");
const {MYNODE} = require("../Constants/constant");

const {broadcast} =  require('../MinerMessage/messageNode');
const {findProofMsg} =  require('../MinerMessage/messageNode');
const {queryAllMsg} =  require('../MinerMessage/messageNode');

const {generateNextBlock} = require("./ClassBlock");
const {getGenesisBlock} = require("./ClassBlock");
const {getLatestBlock} = require("./ClassBlock");
//previousBlock.previousHash

var checkSameIndexBlock = (newBlock, previousBlock, numberZero) => {
    if (previousBlock.previousHash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return BLOCK_FALSE;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log("calculateHashForBlock(newBlock) !== newBlock.hash");
 
        console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return BLOCK_FALSE;
    }
    else if (!CryptoJS.SHA256(newBlock.hash + newBlock.previousHash + newBlock.nonce).toString().startsWith(numberZero)){
        console.log('invalid number zero in hash ' + CryptoJS.SHA256(newBlock.hash + newBlock.previoushash +  newBlock.nonce).toString());
        //console.log(newBlock);
        //console.log(previousBlock);
        return BLOCK_FALSE;
    }
    if (newBlock.timestamp < previousBlock.timestamp){
        console.log("The new block is more recent that our block : newBlock - " + newBlock.timestamp.toString()
                    + " our block - "  + previousBlock.timestamp.toString());
        return SAME_INDEX_AND_MORE_RECENT;
    }
    else if (newBlock.timestamp == previousBlock.timestamp)
    {
        console.log("The two block have the same timestamp => fork in the BlockChain");
        return SAME_INDEX_AND_TIMESTAMP;
    }
    console.log("The new block is less recent that our block : newBlock - " + newBlock.timestamp.toString()
                    + " our block - "  + previousBlock.timestamp.toString());
    return BLOCK_FALSE;
}

//previousBlock.hash

var isValidNewBlock = (newBlock, previousBlock, numberZero) => {
    if (previousBlock.index == newBlock.index){
            console.log("The two block have the same index : " + newBlock.index.toString());
            return (checkSameIndexBlock(newBlock, previousBlock, numberZero));
    }
    if (previousBlock.index + 1 !== newBlock.index) {
        /*
            If newBlock.index > previousBlock.index + 1)
        */
        if (newBlock.index > previousBlock.index + 1){
            broadcast(sockets, queryAllMsg());
        }
        else {
            console.log('invalid index Previous Block : ' + previousBlock.index.toString() + " NewBlock : " + newBlock.index.toString());
            return BLOCK_FALSE;
        }
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return BLOCK_FALSE;
    } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log("calculateHashForBlock(newBlock) !== newBlock.hash");
        return BLOCK_FALSE;
    }
    else if (!CryptoJS.SHA256(newBlock.hash + newBlock.previousHash + newBlock.nonce).toString().startsWith(numberZero)){
        console.log('invalid number zero in hash : ' + CryptoJS.SHA256(newBlock.hash + newBlock.previousHash + newBlock.nonce).toString());
        /*
        console.log('get zero : ' + getZero());
        console.log("start with : " + crypto.startsWith(getZero()));
        console.log("if : " + CryptoJS.SHA256(newBlock.hash + newBlock.previousHash + newBlock.nonce).toString().startsWith(getZero()));
        console.log("previous block hash : " +  newBlock.previousHash);
        console.log("new Block hash : " + newBlock.hash);
        console.log("nonce : " + newBlock.nonce);
        */
        return BLOCK_FALSE;
    }
    return BLOCK_TRUE_AND_DIFFERENT_INDEX;
};

var processBlockFromOtherNode = (newBlock, stateProcess, numberOfBlockChain) => {
    var BlockChain = stateProcess.getDocker()[numberOfBlockChain]
    var latestBlock = getLatestBlock(BlockChain);
    var ret = isValidNewBlock(newBlock, latestBlock, stateProcess.getNumberZero());
    var proofOfWorkFork = stateProcess.getProofOfWorkFork();

    if (ret == SAME_INDEX_AND_TIMESTAMP){
       stateProcess.createForkChain(BlockChain, newBlock)
    }
    else if (ret ==  SAME_INDEX_AND_MORE_RECENT){
       stateProcess.replaceLatestBlock(BlockChain, newBlock)
    }
    else if (ret == BLOCK_TRUE_AND_DIFFERENT_INDEX){
        stateProcess.killProcessFork();
        stateProcess.addBlockToBlockChain(BlockChain, newBlock, OTHERNODE);
        //stateProcess.resetListAndProofOfWorkForkVar();
            
        if (stateProcess.canTransferPoolToList()){
            stateProcess.transferPoolToListTransaction();
            processMyBlock(stateProcess);
        }
    }
    else { 
        console.log("The Block which come from a other node is invalid => remove");
    }
};


var processMyBlock = (stateProcess) => {
        console.log("List Transaction Full => creation new Block");
        var BlockChain = stateProcess.getDocker()[0];

        var latestBlock = getLatestBlock(BlockChain);
        var ListTransaction = stateProcess.getListTransaction();
        var myNewBlock = generateNextBlock(ListTransaction, BlockChain, latestBlock);
        var proofOfWorkFork = stateProcess.initProofOfWorkFork();
        //latestBlock.hash
        proofOfWorkFork.send({"previousHash" : myNewBlock.previousHash,
                                "myNewBlockHash" : myNewBlock.hash,
                                "numberZero" : stateProcess.getNumberZero()});
        proofOfWorkFork.on('message', (proof) => {

            myNewBlock.nonce = proof;

            if (getLatestBlock(BlockChain).index + 1 == myNewBlock.index){

                stateProcess.addBlockToBlockChain(BlockChain, myNewBlock, MYNODE);
                stateProcess.killProcessFork();
                //console.log(stateProcess.getProofOfWorkFork());
            }
            else{
                console.log("myNewBlock is less recent that the Block form other node => delete ");
            }

            //stateProcess.resetListAndProofOfWorkForkVar();

            if (stateProcess.canTransferPoolToList()){
                stateProcess.transferPoolToListTransaction();
                processMyBlock(stateProcess);
            }
        }); 
        proofOfWorkFork.on('exit', function (code, signal) {
            //stateProcess.resetListAndProofOfWorkForkVar();
            return ;
        }); 
};


exports.processBlockFromOtherNode = processBlockFromOtherNode;
exports.processMyBlock = processMyBlock;
exports.isValidNewBlock = isValidNewBlock;
exports.checkSameIndexBlock = checkSameIndexBlock;


//exports.checkIntegrityOfBlockChain = checkIntegrityOfBlockChain;
 //console.log('Child exited'); //, code, signal);
            //stateProcess.resetListAndProofOfWorkFork();
                        //BlockChain[BlockChain.length - 1]

/*
var mutexify = require('../node_modules/mutexify');
var lock = mutexify();
 
          exec('kill -9 ' + proofOfWorkFork.pid  , (err, stdout, stderr) => {
                if (err) { console.error(`exec error: ${err}`); return; }
                console.log("Process PID " + proofOfWorkFork.pid.toString() + " died");
            }); 
*/


