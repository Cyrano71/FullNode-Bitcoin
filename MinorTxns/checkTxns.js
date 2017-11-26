const {clone} = require("../MinorBlock/HashTools");
const {scriptValid} = require("./checkScript");
const {checkScriptOutputValid} = require("./checkScript");
const {MONEY_AND_NAME} = require("../Constants/constant");
const {MONEY_AND_NAME_AND_SCRIPT} = require("../Constants/constant");
const {CHECK_INPUT} = require("../Constants/constant");
const {DONT_CHECK_INPUT} = require("../Constants/constant");

var isInTheList = (ListName, target) => {
    for (var i = 0; i < ListName.length;i++){
        if (JSON.stringify(ListName[i]) == JSON.stringify(target)){
            return true;
        }
    }
    return false;
}

var mergeDictMoneyAndDictTotal = (dictMoney, dictMoneyTotal) => {
    for (var key in dictMoney) {
        if (dictMoneyTotal.hasOwnProperty(key) && key.indexOf("Script") < 0) {
            dictMoneyTotal[key] += dictMoney[key];
        }
        else{
            dictMoneyTotal[key] = dictMoney[key];
        }
    }
}

var gatherMoneyInBlockChain = (BlockChain, listName, type) => {
    var len = BlockChain.length;
    var dictMoney = {};
    var dictMoneyTotal = {};

    while (BlockChain[len - 1].previousHash != "0") {
            dictMoney = gatherMoneyInBlock(BlockChain[len - 1], CHECK_INPUT, listName, type);
            mergeDictMoneyAndDictTotal(dictMoney, dictMoneyTotal);
            len--;
    }
    dictMoney = gatherMoneyInBlock(BlockChain[0], DONT_CHECK_INPUT, listName, type);
    mergeDictMoneyAndDictTotal(dictMoney, dictMoneyTotal);

    console.log("----------------GATHER MONEY-------------");
    console.log(dictMoneyTotal);
    console.log("-----------------------------------------")

    var ListClientDestroy = undefined;
    /*
    if ((ListClientDestroy = containNegativeValue(dictMoneyTotal)) != undefined)
        destructionIntputAndOuptutClient(ListNameClientDestroy, dictTransaction);
    */
    return dictMoneyTotal;
}

var gatherMoneyInBlock = (Block, state, listName, type) => {
        var dictMoney = {};
        var dictTransaction = Block.txns;
        var ListTransactionOutput = dictTransaction["output"];
        //console.log("ListTransactionOutput");
        //console.log(ListTransactionOutput);
        var ListTransactionInput = dictTransaction["input"];

        //console.log(Block);

        for (var i = 0; i < ListTransactionOutput.length; i++){
            var ListTransactionClientOutput = ListTransactionOutput[i];
             for (var j = 0; j < ListTransactionClientOutput.length; j++) {
                var ClientOutput = ListTransactionClientOutput[j];

                /*
                console.log("Origin Key : " + ClientOutput["OriginKey"]);
                console.log("Dest Key : " + ClientOutput["DestKey"]);
                console.log("Value : " + ClientOutput["Value"]);
                */

                var DestKey = ClientOutput["DestKey"];
                //console.log(ClientOutput["DestKey"]);
                //console.log(ClientOutput["Value"]);
                if (isInTheList(listName, DestKey)){
                    if (dictMoney.hasOwnProperty(DestKey)) {
                        dictMoney[DestKey] += ClientOutput["Value"];
                    }
                    else{
                        dictMoney[DestKey] = ClientOutput["Value"];
                        if (type == MONEY_AND_NAME_AND_SCRIPT)
                            dictMoney[DestKey + "Script"] = ClientOutput["Script"];
                    }
                }
            }
        }

       
        if (state == CHECK_INPUT){
         //console.log(ListTransactionInput);
            for (var i = 0; i < ListTransactionInput.length; i++){
                var ListTransactionClientInput = ListTransactionInput[i];
                 for (var j = 0; j < ListTransactionClientInput.length; j++) {
                    var ClientInput = ListTransactionClientInput[j];

                    /*
                    console.log("KeyMaster : " + dictClientInput["KeyMaster"]);
                    console.log("Value : " + dictClientInput["Value"]);
                    console.log("Index Block : " + dictClientInput["Index"]);
                    */

                    var KeyMaster = ClientInput["KeyMaster"];
                    //console.log(ClientInput["KeyMaster"]);
                    //console.log(-ClientOutput["Value"]);
                    if (isInTheList(listName, KeyMaster)){
                        if (dictMoney.hasOwnProperty(KeyMaster)) {
                            dictMoney[KeyMaster] -= ClientInput["Value"];
                        }
                        else{
                            dictMoney[KeyMaster] = 0 - ClientInput["Value"];
                        }
                    }
                }
            }
        }

        //console.log("MoneyBlock : ")
        //console.log(dictMoney);

        return dictMoney;
}

var destructionOutput = (ListNameClientDestroy, ListTransactionOutput) => {
    //console.log("Destroy Output Client : " + NameClientDestroy);

    var newListTransactionOutput = [];

    for (var i = 0; i < ListTransactionOutput.length; i++){

        var ListTransactionClientOutput = ListTransactionOutput[i];
        var newListTransactionClientOutput = [];

        for (var j = 0; j < ListTransactionClientOutput.length; j++) {

            var ClientOutput = ListTransactionClientOutput[j];
            var NameClient = ClientOutput["OriginKey"];
            var ClientSpend = ClientOutput["Value"];
            var DestKey = ClientOutput["DestKey"];

            if (!isInTheList(ListNameClientDestroy, NameClient)) {
                newListTransactionClientOutput.push(ClientOutput);
            }
        }
        newListTransactionOutput.push(newListTransactionClientOutput);
    }

    return newListTransactionOutput;
}

var destructionInput = (ListNameClientDestroy, ListTransactionInput) => {
    //console.log("Destroy Input Client : " + NameClientDestroy);

    var newListTransactionInput = [];

    for (var i = 0; i < ListTransactionInput.length; i++){

        var ListTransactionClientInput = ListTransactionInput[i];
        var newListTransactionClientInput = [];

        for (var j = 0; j < ListTransactionClientInput.length; j++) {

            var dictClientInput = ListTransactionClientInput[j];
            var NameClient = dictClientInput["KeyMaster"];
            var ClientSpend = dictClientInput["Value"];

            if (!isInTheList(ListNameClientDestroy, NameClient)) {
                newListTransactionClientInput.push(dictClientInput);
            }
        }
        newListTransactionInput.push(newListTransactionClientInput);
    }

    return newListTransactionInput;
}

var destructionIntputAndOuptutClient = (ListNameClientDestroy, dictTransaction) => {
    console.log("Destruction Txns : " + ListNameClientDestroy);
    var ListTransactionInput = dictTransaction["input"];
    var ListTransactionOutput = dictTransaction["output"];
    ListTransactionInput = destructionInput(ListNameClientDestroy, ListTransactionInput);
    ListTransactionOutput = destructionOutput(ListNameClientDestroy, ListTransactionOutput);
    dictTransaction["input"] = ListTransactionInput;
    dictTransaction["output"] = ListTransactionOutput;
    return dictTransaction;
}

var checkIfInputAreValid = (ListTransactionInput, dictTransaction, dictMoneyPreviousBlock) => {
        var nameClientDestroy = [];

        for (var i = 0; i < ListTransactionInput.length; i++){
            var ListTransactionClientInput = ListTransactionInput[i];
            for (var j = 0; j < ListTransactionClientInput.length; j++) {

                var dictClientInput = ListTransactionClientInput[j];                
                var NameClient = dictClientInput["KeyMaster"];
                var ClientSpend = dictClientInput["Value"];

                /*
                console.log("KeyMaster : " + dictClientInput["KeyMaster"]);
                console.log("Value : " + dictClientInput["Value"]);
                console.log("Index Block : " + dictClientInput["Index"]);
                */
    
                if (dictMoneyPreviousBlock.hasOwnProperty(NameClient) && ClientSpend > 0) {

                    dictMoneyPreviousBlock[NameClient] -= ClientSpend;

                    if (dictMoneyPreviousBlock[NameClient] < 0){
                        console.log("ErrorInput Spend > InWallet : id " + NameClient
                                    + " value : " + ClientSpend);
                        nameClientDestroy.push(NameClient);
                        /*
                        var index = newListTransactionClientInput.indexOf(NameClient);
                        newListTransactionClientInput.splice(index, 1);
                        */
                    }
                    else{
                        //console.log("MoneyPreviousBlock Enough for ClientInput : id - " + NameClient + " value - " + ClientSpend);
                        //newListTransactionClientInput.push(dictClientInput);
                    }
                }
                else{

                    if (ClientSpend <= 0){
                        console.log("ErrorInput Spend <= 0 : id " + NameClient
                                    + " value : " + ClientSpend);
                    }
                    else{
                        console.log("ErrorKeyInput NoRegister BlockChain : id " + NameClient);
                    }

                    nameClientDestroy.push(NameClient);
                }   
            }
        }

        if (nameClientDestroy.length == 0)
            return  dictTransaction;
        else
            return (destructionIntputAndOuptutClient(nameClientDestroy, dictTransaction));
}

var checkIfOutputAreValid = (ListTransactionOutput, dictTransaction, dictMoneyPreviousBlockCopy) => {

    var nameClientDestroy = [];

    for (var i = 0; i < ListTransactionOutput.length; i++){

            var ListTransactionClientOutput = ListTransactionOutput[i];

            for (var j = 0; j < ListTransactionClientOutput.length; j++) {

                var ClientOutput = ListTransactionClientOutput[j];

                var NameClient = ClientOutput["OriginKey"];
                var ClientSpend = ClientOutput["Value"];
                var DestKey = ClientOutput["DestKey"];
                var ScriptOutput = ClientOutput["Script"];

                if (!checkScriptOutputValid(ScriptOutput)){
                    console.log("ErrorOutput Script id : " + NameClient + " => Lock Money ");
                    console.log("Destruction Txns : id " + NameClient
                                    + " value : " + ClientSpend);
                    nameClientDestroy.push(NameClient);
                }
                else if (dictMoneyPreviousBlockCopy.hasOwnProperty(NameClient) && ClientSpend > 0) {

                    dictMoneyPreviousBlockCopy[NameClient] -= ClientSpend;

                    if (dictMoneyPreviousBlockCopy[NameClient] < 0){
                        console.log("ErrorOutput Spend > InWallet : id " + NameClient
                                    + " value : " + ClientSpend);
                        nameClientDestroy.push(NameClient);
                    }
                    else{
                        //console.log("MoneyPreviousBlock Enough for ClientOutput : id - " + NameClient + " value - " + ClientSpend);
                    }

                }
                else{

                    if (ClientSpend <= 0){
                        console.log("ErrorOutput Spend <= 0 : id " + NameClient
                                    + " value : " + ClientSpend);
                    }
                    else{
                        console.log("ErrorKeyOutput NoRegister BlockChain : id " + NameClient);
                    }

                    nameClientDestroy.push(NameClient);
                }   
            }
        }

        if (nameClientDestroy.length == 0)
            return  dictTransaction;
        else
            return (destructionIntputAndOuptutClient(nameClientDestroy, dictTransaction));
}

var gatherMoneyInputClient = (NameClientSearch, ListTransactionInput) => {
    var MoneyInputClient = 0;

    for (var i = 0; i < ListTransactionInput.length; i++){
        var ListTransactionClientInput = ListTransactionInput[i];
        for (var j = 0; j < ListTransactionClientInput.length; j++) {

            var dictClientInput = ListTransactionClientInput[j];                
            var NameClient = dictClientInput["KeyMaster"];
            var ClientSpend = dictClientInput["Value"];

            //console.log("Key Master gather Money Input :");
            //console.log(NameClient);
            if (JSON.stringify(NameClientSearch) == JSON.stringify(NameClient)){
                MoneyInputClient +=  ClientSpend
            }
            /*
            console.log("KeyMaster : " + dictClientInput["KeyMaster"]);
            console.log("Value : " + dictClientInput["Value"]);
            console.log("Index Block : " + dictClientInput["Index"]);
            */

        }
    }
    return (MoneyInputClient);
}

var gatherMoneyOutputClient = (NameClientSearch, ListTransactionOutput) => {
    var MoneyOutputClient = 0;

    for (var i = 0; i < ListTransactionOutput.length; i++){

            var ListTransactionClientOutput = ListTransactionOutput[i];

            for (var j = 0; j < ListTransactionClientOutput.length; j++) {

                var ClientOutput = ListTransactionClientOutput[j];

                var NameClient = ClientOutput["OriginKey"];
                var ClientSpend = ClientOutput["Value"];
                var DestKey = ClientOutput["DestKey"];

                if (JSON.stringify(NameClientSearch) == JSON.stringify(NameClient)){
                    MoneyOutputClient +=  ClientSpend
                }
            }
    }

    return(MoneyOutputClient);
}

var gatherNameClientOutput = (ListTransactionOutput) => {

    var ListNameClient = [];

    for (var i = 0; i < ListTransactionOutput.length; i++){

            var ListTransactionClientOutput = ListTransactionOutput[i];

            for (var j = 0; j < ListTransactionClientOutput.length; j++) {

                var ClientOutput = ListTransactionClientOutput[j];

                var NameClient = ClientOutput["OriginKey"];
                var ClientSpend = ClientOutput["Value"];
                var DestKey = ClientOutput["DestKey"];

                ListNameClient.push(NameClient)
            }
    }
    return (ListNameClient);
}

var gatherNameClientInput = (ListTransactionInput) => {
    var ListNameClient = [];

    for (var i = 0; i < ListTransactionInput.length; i++){

            var ListTransactionClientInput = ListTransactionInput[i];

            for (var j = 0; j < ListTransactionClientInput.length; j++) {

                var ClientInput = ListTransactionClientInput[j];

                var NameClient = ClientInput["KeyMaster"];
                //var ClientSpend = ClientInput["Value"];
                //var DestKey = ClientInput["DestKey"];

                ListNameClient.push(NameClient)
            }
    }
    return (ListNameClient);
}

var checkConsistencyInputOutput = (dictTransaction) => {
    var MoneyInputTxns = [];
    var MoneyOutputTxns = [];

    var ListNameClient = gatherNameClientOutput(dictTransaction["output"]);

    //console.log(" dictTransaction[output] : ")
    //console.log(dictTransaction["output"]);
    //console.log(" dictTransaction[input] : ")
    //console.log(dictTransaction["input"][0]);

    var ListNameClientDestroy = [];

    for (var i = 0; i < ListNameClient.length; i++){

        var NameClientSearch = ListNameClient[i];
        //console.log("Name Client Search : ");
        //console.log(NameClientSearch);
        MoneyOutputTxns.push(gatherMoneyOutputClient(NameClientSearch, dictTransaction["output"]));
        MoneyInputTxns.push(gatherMoneyInputClient(NameClientSearch, dictTransaction["input"]));

        if (MoneyInputTxns[i] != MoneyOutputTxns[i]){
            console.log("ErrorConsistencyInputOutput : id - " + NameClientSearch + " input - " + MoneyInputTxns[i] + " output - " + MoneyOutputTxns[i]);
            ListNameClientDestroy.push(ListNameClient[i]);
        }
    }

    if (ListNameClientDestroy.length == 0)
            return  dictTransaction;
    else
        return (destructionIntputAndOuptutClient(ListNameClientDestroy, dictTransaction));
}

var checkValidScript = (dictMoneyPreviousBlocks, dictTransaction) => {
    var ListTransactionInput = dictTransaction["input"];
    var ListNameClientDestroy = [];

    for (var key in dictMoneyPreviousBlocks) {

        var index = -1;

        if (dictMoneyPreviousBlocks.hasOwnProperty(key) && (index = key.indexOf("Script")) >= 0) {
            var newKey = key.substring(0, index);
            //console.log(newKey);
            //console.log(ListTransactionInput);

            var outputScript = dictMoneyPreviousBlocks[key];
            var inputScript = undefined;
            var NameClient = undefined;
            var Value = undefined;

            for (var i = 0; i < ListTransactionInput.length; i++){

                var ListTransactionClientInput = ListTransactionInput[i];

                for (var j = 0; j < ListTransactionClientInput.length; j++){
                    
                    var ClientInput = ListTransactionClientInput[j];

                    if (ClientInput["KeyMaster"] == newKey){
                        if (ClientInput["Script"] == undefined){
                            console.log("Error ScriptInput undefined : id " + ClientInput["KeyMaster"]);
                            ListNameClientDestroy.push(ClientInput["KeyMaster"]);
                        }           
                       inputScript = ClientInput["Script"];
                       NameClient = ClientInput["KeyMaster"];
                       Value = ClientInput["Value"];
                    }
                }
            }

            if (inputScript != undefined){
                if (!scriptValid(inputScript, outputScript, NameClient, Value)){
                    ListNameClientDestroy.push(NameClient);
                }
            }
         
        }
    }

    if (ListNameClientDestroy.length == 0)
            return  dictTransaction;
    else
        return (destructionIntputAndOuptutClient(ListNameClientDestroy, dictTransaction));
}

var isValidTxn = (listTransaction, BlockChain) => {
        // Assume that the transaction is a dictionary keyed by account names
        // Check that the sum of the deposits and withdrawals is 0
        //console.log("Start verification");
        //console.log(dictTransaction);

        for (var i = 0; i < listTransaction.length; i++){
            var dictTransaction = listTransaction[i];
            var ListTransactionInput = dictTransaction["input"];
            var ListTransactionOutput = dictTransaction["output"];

            //console.log(ListTransactionInput);
            //console.log(ListTransactionOutput);
            var ListNameClientInput = gatherNameClientInput(ListTransactionInput);
            var dictMoneyPreviousBlocks = gatherMoneyInBlockChain(BlockChain, ListNameClientInput, MONEY_AND_NAME_AND_SCRIPT);
            var dictMoneyPreviousBlocksCopy = clone(dictMoneyPreviousBlocks);

            dictTransaction = checkIfInputAreValid(ListTransactionInput, dictTransaction, dictMoneyPreviousBlocks);
            dictTransaction  = checkIfOutputAreValid(ListTransactionOutput, dictTransaction, dictMoneyPreviousBlocksCopy);
            dictTransaction = checkConsistencyInputOutput(dictTransaction);
            dictTransaction = checkValidScript(dictMoneyPreviousBlocks, dictTransaction);
        }
        /*
        console.log("---------Transaction Input------------");
        console.log(dictTransaction["input"]);
        console.log("---------Transaction Output-----------");
        console.log(dictTransaction["output"]);
        console.log("--------------------------------------");
        */
        return dictTransaction;
}

exports.isValidTxn = isValidTxn;
exports.gatherMoneyInBlockChain = gatherMoneyInBlockChain;

 /*
        var sum = 0;
        for (var i = 0; i < txns.length; i++){
            for (var key in previousState) {
                if (previousState.hasOwnProperty(key)) { 
                    key = key.toString();
                    sum += txns[i][key];
                    //console.log(key);
                    //console.log(txns[i][key]);
                }   
            }
            if (sum != 0) {
                console.log("Err deposit and withdrawals remove index : ");
                console.log(txns[i]);
                txns.splice(i, 1);
            }
            sum = 0;
        }

        // Check that the transaction does not cause an overdraft
        var acctBalance = 0;
        for (var i = 0; i < txns.length; i++){
            for (var key in previousState) {
                if (previousState.hasOwnProperty(key)) {
                    acctBalance = previousState[key];
                }
                else { acctBalance = 0; }
                key = key.toString();
                if (acctBalance + txns[i][key] < 0) {
                    console.log("Err Overdraft remove index : ");
                    console.log(txns[i]);
                    txns.splice(i, 1);
                }
            }
            acctBalance = 0;
        }
        return txns;
*/

/*
updateState(previousState) {
        // Inputs: txn, state: dictionaries keyed with account names, holding numeric values for transfer amount (txn) or account balance (state)
        // Returns: Updated state, with additional users added to state if necessary
        // NOTE: This does not not validate the transaction- just updates the state!
    
        // If the transaction is valid, then update the state
         // As dictionaries are mutable, let's avoid any confusion by creating a working copy of the data.
        
        var newState = clone(previousState);

        for (var i = 0; i < this.txns.length; i++){
            for (var key in newState) {
                if (newState.hasOwnProperty(key)) { newState[key] += this.txns[i][key];}
                else { newState[key] = this.txns[i][key]; }
            }
        }
        return newState;
    }
*/

  /*

        var newListTransactionOutput = [];

        for (var i = 0; i < ListTransactionOutput.length; i++){
            var ListTransactionClientOutput = ListTransactionOutput[i];
            var newListTransactionClientOutput = [];
             for (var j = 0; j < ListTransactionClientOutput.length; j++) {
                var ClientOutput = ListTransactionClientOutput[j];

                
                console.log("Origin Key : " + ClientOutput["OriginKey"]);
                console.log("Dest Key : " + ClientOutput["DestKey"]);
                console.log("Value : " + ¸ClientOutput["Value"]);
                
                var NameClient = ClientOutput["OriginKey"];
                var ClientSpend = ClientOutput["Value"];
                var DestKey = ClientOutput["DestKey"];

                if (dictMoneyPreviousBlock.hasOwnProperty(NameClient)
                    && dictMoneyPreviousBlockCopy.hasOwnProperty(NameClient)) {
                    if (dictMoneyPreviousBlock[NameClient] >= 0
                        && dictMoneyPreviousBlockCopy[NameClient] >= 0){
                        console.log("Txns valide : id - " + NameClient + " value - " + ClientSpend
                                    + " DestKey - " + DestKey);
                        newListTransactionClientOutput.push(ClientOutput);
                    }
                    else{
                        console.log("Txns invalid : OriginKey - " + NameClient + " value - " + ClientSpend
                                    + " DestKey - " + DestKey);
                    }
                }
                else{
                    //console.log("ErrorKey NoRegister BlockChain : OriginKey - " + NameClient + " value - " + ClientSpend
                     //               + " DestKey - " + DestKey);
                }   
            }
            if (newListTransactionClientOutput.length != 0)
                newListTransactionOutput.push(newListTransactionClientOutput);
        }
        */

        //console.log("Verification done");
        /*
        if (newListTransactionOutput.length == 0)
            dictTransaction["input"] = [];
        else
            dictTransaction["input"] = newListTransactionInput;
        if (newListTransactionInput.length == 0)
            dictTransaction["output"] = [];
        else
            dictTransaction["output"] = newListTransactionOutput;

        dictTransaction["input"] = newListTransactionInput;
        dictTransaction["output"] = newListTransactionOutput;
        */
