var CryptoJS = require("../node_modules/crypto-js");

const {calculateHash} = require("./HashTools");

const {isValidTxn} = require("../MinerTxns/checkTxns");

//const {createScriptBlock} = require("../MinerTxns/CreateSampleScriptBlock");
//const {creationTxnsInput} = require("../MinerTxns/CreateSampleScriptBlock");
//const {creationTxnsOutput} = require("../MinerTxns/CreateSampleScriptBlock");
//const {createFakeInput} = require("../MinerTxns/CreateSampleScriptBlock");

const {creationTransactionInput} = require("../MinerTxns/CreateSampleScriptBlock");
const {creationTransactionOutput} = require("../MinerTxns/CreateSampleScriptBlock");
const {ALICE} = require("../Constants/constant");
const {BOB} = require("../Constants/constant");
const {ALICETOBOB} = require("../Constants/constant");
const {ALICETOALICE} = require("../Constants/constant");
const {BOBTOBOB}  = require("../Constants/constant");
const {BOBTOALICE} = require("../Constants/constant");
/*
const {generateNextBlock} = require("./BlockTools");
const {getGenesisBlock} = require("./BlockTools");
const {getLatestBlock} = require("./BlockTools");
const {isValidNewBlock} = require("./BlockTools");
const {checkSameIndexBlock} = require("./BlockTools");
const {processMyBlock} = require("./BlockTools");
const {processBlockFromOtherNode} = require("./BlockTools");
const {checkIntegrityOfBlockChain} = require("./BlockTools");
*/

/*
//Destroy this require Infinite loop const {checkIntegrityOfBlockChain} = require("../MinerBlockChain/BlockChainTools");
const {generateNextBlock} = require("../MinerBlock/ClassBlock");
const {getGenesisBlock} = require("../MinerBlock/ClassBlock");
const {getLatestBlock} = require("../MinerBlock/ClassBlock");
const {isValidNewBlock} = require("../MinerBlock/ClassBlock");
const {checkSameIndexBlock} = require("../MinerBlock/ClassBlock");

const {OTHERNODE} = require("../Constants/constant");
const {MYNODE} = require("../Constants/constant"); 
const {LISTTRANSACTIONFULL} = require("../Constants/constant"); 
const {LISTNOTFULL} = require("../Constants/constant"); 
const {NB_TRANSACTION_PER_BLOCK} = require("../Constants/constant"); 
const {replaceChain} = require("../MinerBlockChain/BlockChainTools");
const {isValidChain} = require("../MinerBlockChain/BlockChainTools");
*/


class Block {

    constructor(BlockChain, index, previousHash, timestamp, txns) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.nonce = 0;
       

        if (BlockChain.length != 0){
            this.txns = isValidTxn(txns, BlockChain);
        }
        else {
            this.txns = txns;
            //console.log("Genesis Block : ");
            //console.log(this.txns["input"]);
            //console.log(this.txns["output"]);
        }
        this.txnCount = this.txns["output"].length;
        this.merkelTree = this.createMerkelTree(this.txns);
        this.hash = calculateHash(this.index, this.previousHash, this.timestamp, this.merkelTree).toString();
        //console.log(this.hash);
        //console.log(this.txns.toString());
    }

    createMerkelTree(dictTransaction){
     
        var merkelTreeHash = 0;

        var ListTransactionInput = dictTransaction["input"];
        var ListTransactionOutput = dictTransaction["output"];

        for (var i = 0; i < ListTransactionOutput.length; i++){
            var ListTransactionClientOutput = ListTransactionOutput[i];
             for (var j = 0; j < ListTransactionClientOutput.length; j++) {
                var ClientOutput = ListTransactionClientOutput[j];

                /*
                console.log("Origin Key : " + ClientOutput["OriginKey"]);
                console.log("Dest Key : " + ClientOutput["DestKey"]);
                console.log("Value : " + ClientOutput["Value"]);
                */

                merkelTreeHash += CryptoJS.SHA256(ClientOutput["OriginKey"] + ClientOutput["DestKey"] + ClientOutput["Value"]).toString();
                merkelTreeHash = CryptoJS.SHA256(merkelTreeHash).toString();
            }
        }

        for (var i = 0; i < ListTransactionInput.length; i++){
            var ListTransactionClientInput = ListTransactionInput[i];
             for (var j = 0; j < ListTransactionClientInput.length; j++) {
                var ClientInput = ListTransactionClientInput[j];

                /*
                console.log("KeyMaster : " + ClientInput["KeyMaster"]);
                console.log("Value : " + ClientInput["Value"]);
                console.log("Index Block : " + ClientInput["Index"]);
                */

                merkelTreeHash += CryptoJS.SHA256(ClientInput["KeyMaster"] + ClientInput["Value"] +  ClientInput["Index"]).toString();
                merkelTreeHash = CryptoJS.SHA256(merkelTreeHash).toString();
            }
        }

        return merkelTreeHash;

    /*
        var dictTransactionInput = [];
    var dictTransactionOutput = [];
    
         dictTransactionInput.push(dictTransactionAliceInput)
    dictTransactionOutput.push(dictTransactionAliceOutput);
    
    var dictTransaction = {};
        var dictTransactionInput = [];
        var dictTransactionOutput = [];
        */

    }

    getNonce(){
    	return this.nonce;
    }

    getIndex(){
    	return this.index;
    }

    getHash(){
    	return this.hash;
    }

    getPreviousHash(){
    	return this.previousHash;
    }  
}

var getLatestBlock = (blockchain) => {
    if (blockchain.length == 0) {
        return null;
    }
    else {
        return blockchain[blockchain.length - 1];
    }
};

var getGenesisBlock = (BlockChain) => {
 	var timestamp = 1465154705;

    
    var dictScript = {};
    var dictKey = {};
    //createScriptBlock(dictScript, dictKey);

    var client = ALICE;
    var valueInput = 0;
    var index = -1;
    var AliceInput1 = creationTransactionInput(client, dictScript, dictKey, valueInput, index);
    var AliceInput2 = creationTransactionInput(client, dictScript, dictKey, valueInput, index);

    /*
    var AliceInput1 = creationTxnsInput(ALICE, 0, -1, dictScript, dictKey);
    var AliceInput2 = creationTxnsInput(ALICE, 0, -1, dictScript, dictKey);
    */

    var ListTransactionAliceInput = [];
    ListTransactionAliceInput.push(AliceInput1);
    ListTransactionAliceInput.push(AliceInput2);

    var typeTransaction = ALICETOALICE;
    var valueOutput = 150;
    var AliceOutput1 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);
    var typeTransaction = ALICETOBOB;
    var valueOutput = 50;
    var AliceOutput2 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);
    /*
    var AliceOutput1 = creationTxnsOutput(ALICETOALICE, 150, dictScript, dictKey); 
    var AliceOutput2 = creationTxnsOutput(ALICETOBOB, 50, dictScript, dictKey);
    */

    var ListTransactionAliceOutput = [];
    ListTransactionAliceOutput.push(AliceOutput1);
    ListTransactionAliceOutput.push(AliceOutput2);

    var ListTransactionInput = [];
    var ListTransactionOutput = [];
    
    ListTransactionInput.push(ListTransactionAliceInput)
    ListTransactionOutput.push(ListTransactionAliceOutput);
    
    var dictTransaction = {};
    dictTransaction["input"] = ListTransactionInput;
    dictTransaction["output"] =  ListTransactionOutput;

    return new Block(BlockChain, 0, "0", timestamp, dictTransaction);
};

var generateNextBlock = (blockTransaction, BlockChain, previousBlock) => {
    var previousBlockHash = previousBlock.hash; //getLatestBlock(BlockChain);
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp =  1507372929 //new Date().getTime() / 1000; //1507234186.921 
    //console.log("The timestamp of my block is " + nextTimestamp);
    //JSON.parse blockTransaction;
    //var nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockTransaction);
    return new Block(BlockChain, nextIndex, previousBlockHash, nextTimestamp, blockTransaction);//, nextHash);
};

exports.Block = Block;
exports.generateNextBlock = generateNextBlock;
exports.getGenesisBlock = getGenesisBlock;
exports.getLatestBlock = getLatestBlock;

/*

var createNewBlock = (BlockChain) => {
    var timestamp = 1465154715;

    var dictScript = {};
    var dictKey = {};

    //createScriptBlock(dictScript, dictKey); 

    var client = ALICE;
    var valueInput = 150;
    var index = 0;
    var AliceInput1 = creationTransactionInput(client, dictScript, dictKey, valueInput, index);

    //var AliceInput1 = creationTxnsInput(ALICE, 150, 0, dictScript, dictKey);
  
    var ListTransactionAliceInput = [];
    ListTransactionAliceInput.push(AliceInput1);
    //ListTransactionAliceInput.push(FakeInput1);
   // ListTransactionAliceInput.push(FakeInput2);

    var typeTransaction = ALICETOALICE;
    var valueOutput = 140;
    var AliceOutput1 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);
    var typeTransaction = ALICETOBOB;
    var valueOutput = 10;
    var AliceOutput2 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);

    //var AliceOutput1 = creationTxnsOutput(ALICETOALICE, 140, dictScript, dictKey); 
    //var AliceOutput2 = creationTxnsOutput(ALICETOBOB, 10, dictScript, dictKey);
    
    var ListTransactionAliceOutput = [];
    ListTransactionAliceOutput.push(AliceOutput1);
    ListTransactionAliceOutput.push(AliceOutput2);
    //ListTransactionAliceOutput.push(FakeOutput1);
    //ListTransactionAliceOutput.push(FakeOutput2);
    //ListTransactionAliceOutput.push(FakeOutput3);

    var ListTransactionInput = [];
    var ListTransactionOutput = [];
    
    ListTransactionInput.push(ListTransactionAliceInput)
    ListTransactionOutput.push(ListTransactionAliceOutput);
    
    var dictTransaction = {};
    dictTransaction["input"] = ListTransactionInput;
    dictTransaction["output"] =  ListTransactionOutput;

    return new Block(BlockChain, 1, "4567df8522192540c6d9d025d970e80577c65663bfd0da00b259bcd4b93209f4", timestamp, dictTransaction);
}

var createNewBlock2 = (BlockChain) => {
    var timestamp = 1465154725;

  
    var dictScript = {};
    var dictKey = {};
    //createScriptBlock(dictScript, dictKey); 

    var client = ALICE;
    var valueInput = 140;
    var index = 1;
    var AliceInput1 = creationTransactionInput(client, dictScript, dictKey, valueInput, index);
    //var AliceInput1 = creationTxnsInput(ALICE, 140, 1, dictScript, dictKey);

   
    var ListTransactionAliceInput = [];
    ListTransactionAliceInput.push(AliceInput1);

    var typeTransaction = ALICETOALICE;
    var valueOutput = 130;
    var AliceOutput1 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);
    var typeTransaction = ALICETOBOB;
    var valueOutput = 10;
    var AliceOutput2 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);

    //var AliceOutput1 = creationTxnsOutput(ALICETOALICE, 130, dictScript, dictKey); 
    //var AliceOutput2 = creationTxnsOutput(ALICETOBOB, 10, dictScript, dictKey);
    

    var ListTransactionAliceOutput = [];
    ListTransactionAliceOutput.push(AliceOutput1);
    ListTransactionAliceOutput.push(AliceOutput2);

    var ListTransactionInput = [];
    var ListTransactionOutput = [];
    
    ListTransactionInput.push(ListTransactionAliceInput)
    ListTransactionOutput.push(ListTransactionAliceOutput);
    
    var dictTransaction = {};
    dictTransaction["input"] = ListTransactionInput;
    dictTransaction["output"] =  ListTransactionOutput;

    return new Block(BlockChain, 2, "4567df8522192540c6d9d025d970e80577c65663bfd0da00b259bcd4b93209f4", timestamp, dictTransaction);
}

var createNewBlock3 = (BlockChain) => {
    var timestamp = 1465154735;

    var dictScript = {};
    var dictKey = {};
    //createScriptBlock(dictScript, dictKey); 

    var client = ALICE;
    var valueInput = 130;
    var index = 2;
    var AliceInput1 = creationTransactionInput(client, dictScript, dictKey, valueInput, index);
    
    //var AliceInput1 = creationTxnsInput(ALICE, 130, 2, dictScript, dictKey);
    
    var ListTransactionAliceInput = [];
    ListTransactionAliceInput.push(AliceInput1);

    var typeTransaction = ALICETOALICE;
    var valueOutput = 120;
    var AliceOutput1 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);
    var typeTransaction = ALICETOBOB;
    var valueOutput = 10;
    var AliceOutput2 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);

    //var AliceOutput1 = creationTxnsOutput(ALICETOALICE, 120, dictScript, dictKey); 
    //var AliceOutput2 = creationTxnsOutput(ALICETOALICE, 10, dictScript, dictKey);

    var ListTransactionAliceOutput = [];
    ListTransactionAliceOutput.push(AliceOutput1);
    ListTransactionAliceOutput.push(AliceOutput2);

    var ListTransactionInput = [];
    var ListTransactionOutput = [];
    
    ListTransactionInput.push(ListTransactionAliceInput)
    ListTransactionOutput.push(ListTransactionAliceOutput);
    
    var dictTransaction = {};
    dictTransaction["input"] = ListTransactionInput;
    dictTransaction["output"] =  ListTransactionOutput;

    return new Block(BlockChain, 3, "4567df8522192540c6d9d025d970e80577c65663bfd0da00b259bcd4b93209f4", timestamp, dictTransaction);
}

var createNewBlock4 = (BlockChain) => {
    var timestamp = 1465154735;

    var dictScript = {};
    var dictKey = {};
    //createScriptBlock(dictScript, dictKey); 

    var client = BOB;
    var valueInput = 10;
    var index = 2;
    var BobInput1 = creationTransactionInput(client, dictScript, dictKey, valueInput, index);

    //var BobInput1 = creationTxnsInput(BOB, 5, 3, dictScript, dictKey);
    //var FakeInput1 = createFakeInput(3);

    var ListTransactionBobInput = [];
    ListTransactionBobInput.push(BobInput1);
    //ListTransactionBobInput.push(FakeInput1);

    var typeTransaction = BOBTOBOB;
    var valueOutput = 5;
    var BobOutput1 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);
    var typeTransaction = BOBTOALICE;
    var valueOutput = 5;
    var BobOutput2 = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);

    //var BobOutput1 = creationTxnsOutput(BOBTOBOB, 5, dictScript, dictKey); 

    var ListTransactionBobOutput = [];
    ListTransactionBobOutput.push(BobOutput1);
    ListTransactionBobOutput.push(BobOutput2);

    var ListTransactionInput = [];
    var ListTransactionOutput = [];
    
    ListTransactionInput.push(ListTransactionBobInput)
    ListTransactionOutput.push(ListTransactionBobOutput);
    
    var dictTransaction = {};
    dictTransaction["input"] = ListTransactionInput;
    dictTransaction["output"] =  ListTransactionOutput;

    return new Block(BlockChain, 4, "4567df8522192540c6d9d025d970e80577c65663bfd0da00b259bcd4b93209f4", timestamp, dictTransaction);
}

var BlockChain = [];
BlockChain.push(getGenesisBlock(BlockChain));
BlockChain.push(createNewBlock(BlockChain));
BlockChain.push(createNewBlock2(BlockChain));
BlockChain.push(createNewBlock3(BlockChain));
BlockChain.push(createNewBlock4(BlockChain));

printBlockChain(BlockChain, 6003);
*/

//console.log(BlockChain);

/*
getGenesisBlock

    var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,4);
    var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,4);

    var HashKeyPublic1 = CryptoJS.RIPEMD160(keypublic1).toString().substring(0,4);
    var HashKeyPublic2 = CryptoJS.RIPEMD160(keypublic2).toString().substring(0,4);

    var LengthHashKey1 = HashKeyPublic1.length.toString(16);
    if (LengthHashKey1.length == 1){
        LengthHashKey1 = "".concat("0",LengthHashKey1)
    }
    var LengthHashKey2 = HashKeyPublic2.length.toString(16);
    if (LengthHashKey2.length == 1){
        LengthHashKey2 = "".concat("0",LengthHashKey2)
    }

    var prependScript = "76a9";
    var appendScript = "88ac";

    AliceInput1["KeyMaster"] = keypublic1;
    AliceInput1["Value"] = 0;
    AliceInput1["Index"] = -1;
    AliceInput1["Script"] = undefined

    var AliceInput2 = {};
    AliceInput2["KeyMaster"] = keypublic1;
    AliceInput2["Value"] = 0;
    AliceInput2["Index"] = -1;
    AliceInput2["Script"] = undefined;

    var AliceOutput1 = {};
    AliceOutput1["OriginKey"] = keypublic1;
    AliceOutput1["DestKey"] = keypublic1;
    AliceOutput1["Value"] = 150;
    AliceOutput1["Script"] = prependScript + LengthHashKey1 + HashKeyPublic1 + appendScript;
    var AliceOutput2 = {};
    AliceOutput2["OriginKey"] = keypublic1;
    AliceOutput2["DestKey"] = keypublic2;
    AliceOutput2["Value"] = 50;
    AliceOutput2["Script"] = prependScript + LengthHashKey2 + HashKeyPublic2  + appendScript;
    
    var timestamp = 1465154705;
    var listTransaction = [];
    var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,3);
    var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,3);
    var dictTransaction = {};
    var state = {};
    dictTransaction[keypublic1] = -5;
    dictTransaction[keypublic2] = 5;
    listTransaction.push(dictTransaction); 
    state[keypublic1] = 50;
    state[keypublic2] = 50;
    return new Block(BlockChain, 0, "0", timestamp, listTransaction, state);
*/

/*
createNewBlock
  
    AliceInput1["KeyMaster"] = keypublic1;
    AliceInput1["Value"] = 0;
    AliceInput1["Index"] = -1;
    AliceInput1["Script"] = undefined

     //var AliceInput2 = creationTxnsInput("Alice", 150, 0, dictScript, dictKey);


    var AliceInput1 = {};
    AliceInput1["KeyMaster"] = keypublic1;
    AliceInput1["Value"] = 150;
    AliceInput1["Index"] = 0;
    AliceInput1["Script"] = ScriptInputAlice;

    var AliceOutput1 = {};
    AliceOutput1["OriginKey"] = keypublic1;
    AliceOutput1["DestKey"] = keypublic1;
    AliceOutput1["Value"] = 140;

    AliceOutput1["Script"] = 

    var AliceOutput2 = {};
    AliceOutput2["OriginKey"] = keypublic1;
    AliceOutput2["DestKey"] = keypublic2;
    AliceOutput2["Value"] = 10;
    AliceOutput2["Script"] = 

*/

/*
createNewBlock2
 var signature = "Alice";
    var LengthSignature = signature.length.toString(16);
    if (LengthSignature.length == 1){
        LengthSignature = "".concat("0",LengthSignature)
    }

    var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,4);
    var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,4);

    var LengthKeyPublic = keypublic1.length.toString(16);
    if (LengthKeyPublic.length == 1){
        LengthKeyPublic = "".concat("0",LengthKeyPublic)
    }

    var HashKeyPublic1 = CryptoJS.RIPEMD160(keypublic1).toString().substring(0,4);
    var HashKeyPublic2 = CryptoJS.RIPEMD160(keypublic2).toString().substring(0,4);
    
    var LengthHashKey1 = HashKeyPublic1.length.toString(16);
    if (LengthHashKey1.length == 1){
        LengthHashKey1 = "".concat("0",LengthHashKey1)
    }
    var LengthHashKey2 = HashKeyPublic2.length.toString(16);
    if (LengthHashKey2.length == 1){
        LengthHashKey2 = "".concat("0",LengthHashKey2)
    }

    var prependScript = "76a9";
    var appendScript = "88ac";

     var AliceInput1 = {};
    AliceInput1["KeyMaster"] = keypublic1;
    AliceInput1["Value"] = 140;
    AliceInput1["Index"] = 1;
    AliceInput1["Script"] = "05Alice04" + keypublic1;

      var AliceOutput1 = {};
    AliceOutput1["OriginKey"] = keypublic1;
    AliceOutput1["DestKey"] = keypublic1;
    AliceOutput1["Value"] = 130;
    AliceOutput1["Script"] = "76a904" + HashKeyPublic1 + "88ac";

    var AliceOutput2 = {};
    AliceOutput2["OriginKey"] = keypublic1;
    AliceOutput2["DestKey"] = keypublic2;
    AliceOutput2["Value"] = 10;
    AliceOutput2["Script"] = "76a904" + HashKeyPublic2 + "88ac";

*/

/*
createNewBlock3
    var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,4);
    var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,4);
    
    var HashKeyPublic1 = CryptoJS.RIPEMD160(keypublic1).toString().substring(0,4);
    var HashKeyPublic2 = CryptoJS.RIPEMD160(keypublic2).toString().substring(0,4);

     var AliceInput1 = {};
    AliceInput1["KeyMaster"] = keypublic1;
    AliceInput1["Value"] = 130;
    AliceInput1["Index"] = 2;
    AliceInput1["Script"] = "05Alice04" + keypublic1;

    var AliceOutput1 = {};
    AliceOutput1["OriginKey"] = keypublic1;
    AliceOutput1["DestKey"] = keypublic1;
    AliceOutput1["Value"] = 120;
    AliceOutput1["Script"] = "76a904" + HashKeyPublic1 + "88ac";
    var AliceOutput2 = {};
    AliceOutput2["OriginKey"] = keypublic1;
    AliceOutput2["DestKey"] = keypublic1;
    AliceOutput2["Value"] = 10;
    AliceOutput2["Script"] = "76a904" + HashKeyPublic1 + "88ac";

*/