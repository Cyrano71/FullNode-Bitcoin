var express = require("express");

var printInput = (ListTransactionInput) => {
    var strFile = "";
    for (var i = 0; i < ListTransactionInput.length; i++){
        var ListTransactionClientInput = ListTransactionInput[i];
        for (var j = 0; j < ListTransactionClientInput.length; j++) {

            var dictClientInput = ListTransactionClientInput[j];                
            var NameClient = dictClientInput["KeyMaster"];
            var ClientSpend = dictClientInput["Value"];

            var newDictClient = {};
            newDictClient["KeyMaster"] = NameClient;
            newDictClient["Value"] = ClientSpend;
            strFile += JSON.stringify(newDictClient);
        }
    }
    return (strFile);
}

var printBlockChain = (BlockChain, numberFile) => {
    const fs = require('fs');
    var strFile = ""
	strFile += "----------PRINT BLOCKCHAIN IN FILE------------\n";
	var len = BlockChain.length;
	while (BlockChain[len - 1].previousHash != "0") {
        strFile += "TxnsOutput : \n"
	    strFile += JSON.stringify(BlockChain[len - 1].txns["output"]);
        strFile += "\nTxnsInput\n";
	    strFile += printInput(BlockChain[len - 1].txns["input"]);
        strFile += "\n\n";
        strFile += "-----------------------------------------------\n";
	    len--;
	}
    strFile += "TxnsOutput : \n"
	strFile += JSON.stringify(BlockChain[len - 1].txns["output"]);
    strFile += "\nTxnsInput\n";
	strFile += printInput(BlockChain[len - 1].txns["input"]);

    var FilePath = "./WalletClient/IntegrityBlockChain/Log" + numberFile + ".txt";
    
    try {
        fs.writeFileSync(FilePath, strFile);
        return 'BlockChainSave in : ' + FilePath;
    }
    catch(err){
        return (err);
    }
    /*
    (err) => {  
        // throws an error, you could also catch it here
        if (err) {
            throw err;
            return 'Error printBlockChain';
        }

        // success case, the file was saved
        return 
    }
    */
}

exports.printBlockChain = printBlockChain;