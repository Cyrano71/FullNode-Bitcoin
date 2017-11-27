var CryptoJS = require("../node_modules/crypto-js");

const {queryChainLengthMsg} = require('../MinerMessage/messageNode');
const {queryAllMsg} =  require('../MinerMessage/messageNode');
const {responseChainMsg} =  require('../MinerMessage/messageNode');
const {responseLatestMsg} =  require('../MinerMessage/messageNode');
const {findProofMsg} =  require('../MinerMessage/messageNode');
const {write} =  require('../MinerMessage/messageNode');
const {broadcast} =  require('../MinerMessage/messageNode');
const {parseMessage} = require('../MinerMessage/messageNode');

const {generateNextBlock} = require("../MinerBlock/ClassBlock");
const {getGenesisBlock} = require("../MinerBlock/ClassBlock");
const {getLatestBlock} = require("../MinerBlock/ClassBlock");

const {isValidNewBlock} = require("../MinerBlock/BlockTools");
const {checkSameIndexBlock} = require("../MinerBlock/BlockTools");

/*
const {calculateHashForBlock} = require("../MinerBlock/HashTools");
const {getZero} = require("../MinerBlock/HashTools");
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