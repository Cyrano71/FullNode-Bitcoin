var destroyFirstChain = (DockerChain, numberChain, newBlockChainIndex) => {
    BlockChain1 = DockerChain[0];
    BlockChainI = DockerChain[numberChain];
    for(var numberBlock = BlockChain1.length - 1; numberBlock > newBlockChainIndex; numberBlock--){
        BlockChain1.splice(numberBlock, 1);
    }
    for (numberBlock = 0; numberBlock < BlockChainI.length; numberBlock++){
        BlockChain1.push(BlockChainI[numberBlock]);
    }
    DockerChain.splice(0, 1);
}

var OneChainIsmoreLonger = (stateProcess, DockerChain) => {
    var FistChain = 0;
    for(var numberChain = 1; numberChain < DockerChain.length; numberChain++) {
        var index = stateProcess.getIndexForInBlockChain(numberChain);
        var LengthBlockChain1 = DockerChain[FistChain].length - index;
        var LengthBlockChain2 = DockerChain[numberChain].length;
        if (LengthBlockChain1 < LengthBlockChain2){
            console.log("LengthBlockChain1 < " + "LengthBlockChain" + (numberChain + 1));
            console.log("Destruction BlockChain number 1 => resolution fork");
            destroyFirstChain(DockerChain, numberChain, index);
            stateProcess.resetIndexForkInBlockChain(numberChain);
        }
        else if (LengthBlockChain1 > LengthBlockChain2){
            console.log("LengthBlockChain1 > " + "LengthBlockChain" + (numberChain + 1));
            console.log("Destruction BlockChain number " + (numberChain + 1) + "  => resolution fork");
            DockerChain.splice(numberChain, 1);
            stateProcess.resetIndexForkInBlockChain(numberChain);
        }
        else {
            console.log("The two chain have the same length : " + LengthBlockChain1);
        }
    }
}

exports.destroyFirstChain = destroyFirstChain;
exports.OneChainIsmoreLonger = OneChainIsmoreLonger;