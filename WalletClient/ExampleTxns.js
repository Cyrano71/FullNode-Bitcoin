const {creationTransactionInput} = require("../MinerTxns/CreateSampleScriptBlock");
const {creationTransactionOutput} = require("../MinerTxns/CreateSampleScriptBlock");
const {ALICE} = require("../Constants/constant");
const {BOB} = require("../Constants/constant");
const {ALICETOBOB} = require("../Constants/constant");
const {ALICETOALICE} = require("../Constants/constant");
const {BOBTOBOB}  = require("../Constants/constant");
const {BOBTOALICE} = require("../Constants/constant");

var createNewTxns = () => {
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

    return dictTransaction;
    //return new Block(BlockChain, 1, "4567df8522192540c6d9d025d970e80577c65663bfd0da00b259bcd4b93209f4", timestamp, dictTransaction);
}


var createNewTxns2 = () => {
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

    return dictTransaction;
    //return new Block(BlockChain, 2, "4567df8522192540c6d9d025d970e80577c65663bfd0da00b259bcd4b93209f4", timestamp, dictTransaction);
}

var createNewTxns3 = () => {
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

    return dictTransaction;
    //return new Block(BlockChain, 3, "4567df8522192540c6d9d025d970e80577c65663bfd0da00b259bcd4b93209f4", timestamp, dictTransaction);
}

var createNewTxns4 = () => {
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

    return dictTransaction;
    //return new Block(BlockChain, 4, "4567df8522192540c6d9d025d970e80577c65663bfd0da00b259bcd4b93209f4", timestamp, dictTransaction);
}

exports.createNewTxns = createNewTxns;
exports.createNewTxns2 = createNewTxns2;
exports.createNewTxns3 = createNewTxns3;
exports.createNewTxns4 = createNewTxns4;
