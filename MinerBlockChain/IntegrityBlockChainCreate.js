const {OneChainIsmoreLonger} = require("../MinerBlockChain/ForkChainTools");

var checkIntegrityOfBlockChain = (DockerChain, BlockChain, stateProcess) => {
    console.log("Check Integrity of BlockChain");
    previousBlock = BlockChain[BlockChain.length - 2];
    currentBlock = BlockChain[BlockChain.length - 1]
    if (previousBlock.index == currentBlock.index){
        //console.log("Two Block have the same index");
        if (previousBlock.timestamp > currentBlock.timestamp){
            console.log("previousBlock.timestamp > currentBlock.timestamp");
            BlockChain.pop();
        }
        else if (previousBlock.timestamp < currentBlock.timestamp){
            console.log("previousBlock.timestamp < currentBlock.timestamp");
            BlockChain.slice(BlockChain.length - 2, 1);
        }
        else{
            console.log("Duplicate the BlockChain");
            ForkBlockChain = [BlockChain[BlockChain.length - 3], currentBlock];
            BlockChain.slice(BlockChain.length - 1, 1);
            DockerChain.push(ForkBlockChain);
            stateProcess.setForkInBlockChainIndex(BlockChain.length - 2);
        }
    }
    else if (DockerChain.length > 1){
        OneChainIsmoreLonger(stateProcess, DockerChain);
    }
}

exports.checkIntegrityOfBlockChain = checkIntegrityOfBlockChain;