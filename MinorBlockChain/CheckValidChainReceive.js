var CryptoJS = require("../node_modules/crypto-js");

const {queryChainLengthMsg} = require('../MinorMessage/messageNode');
const {queryAllMsg} =  require('../MinorMessage/messageNode');
const {responseChainMsg} =  require('../MinorMessage/messageNode');
const {responseLatestMsg} =  require('../MinorMessage/messageNode');
const {findProofMsg} =  require('../MinorMessage/messageNode');
const {write} =  require('../MinorMessage/messageNode');
const {broadcast} =  require('../MinorMessage/messageNode');
const {parseMessage} = require('../MinorMessage/messageNode');

const {generateNextBlock} = require("../MinorBlock/ClassBlock");
const {getGenesisBlock} = require("../MinorBlock/ClassBlock");
const {getLatestBlock} = require("../MinorBlock/ClassBlock");

const {isValidNewBlock} = require("../MinorBlock/BlockTools");
const {checkSameIndexBlock} = require("../MinorBlock/BlockTools");

/*
const {calculateHashForBlock} = require("../MinorBlock/HashTools");
const {getZero} = require("../MinorBlock/HashTools");
*/

var replaceChain = (newBlocks, DockerChain, sockets, numberZero) => {
	BlockChain = DockerChain[0];
    if (isValidChain(newBlocks, BlockChain, numberZero) && newBlocks.length > BlockChain.length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        DockerChain[0] = newBlocks;
        broadcast(sockets, responseLatestMsg(DockerChain[0]));
    } else {
        console.log('Received blockchain invalid');
    }
};

var isValidChain = (blockchainToValidate, BlockChain, numberZero) => {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(BlockChain[0])) {
        return false;
    }
    var tempBlocks = [blockchainToValidate[0]];
    for (var i = 1; i < blockchainToValidate.length; i++) {
        if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1], numberZero)) {
            tempBlocks.push(blockchainToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
};

exports.replaceChain = replaceChain;
exports.isValidChain = isValidChain;
//exports.checkIntegrityOfBlockChain = checkIntegrityOfBlockChain;