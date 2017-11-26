

var createNewBlock = (BlockChain) => {
    var timestamp = 1465154715;

    var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,4);
    var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,4);
    
    var AliceInput1 = {};
    AliceInput1["KeyMaster"] = keypublic1;
    AliceInput1["Value"] = 150;
    AliceInput1["Index"] = 0;

    /*
    No enough Money in Wallet
    */
    var FakeInput1 = {};
    FakeInput1["KeyMaster"] = keypublic1;
    FakeInput1["Value"] = 350;
    FakeInput1["Index"] = 0;

    /*
    Negative Value
    */
    var FakeInput2 = {};
    FakeInput2["KeyMaster"] = keypublic1;
    FakeInput2["Value"] = -50;
    FakeInput2["Index"] = 0;

    var ListTransactionAliceInput = [];
    ListTransactionAliceInput.push(AliceInput1);
    //ListTransactionAliceInput.push(FakeInput1);
   // ListTransactionAliceInput.push(FakeInput2);

    var AliceOutput1 = {};
    AliceOutput1["OriginKey"] = keypublic1;
    AliceOutput1["DestKey"] = keypublic1;
    AliceOutput1["Value"] = 140;
    var AliceOutput2 = {};
    AliceOutput2["OriginKey"] = keypublic1;
    AliceOutput2["DestKey"] = keypublic2;
    AliceOutput2["Value"] = 10;

    /*
    The Key doesn't exist
    */
    var FakeOutput1 = {};
    FakeOutput1["OriginKey"] = "fake1";
    FakeOutput1["DestKey"] = keypublic1;
    FakeOutput1["Value"] = 140;

    /*
    The key exists but not enough money
    */
    var FakeOutput2 = {};
    FakeOutput2["OriginKey"] =  keypublic1;
    FakeOutput2["DestKey"] = keypublic1;
    FakeOutput2["Value"] = 340;
    
    /*
    Value <= 0
    */
    var FakeOutput3 = {};
    FakeOutput3["OriginKey"] =  keypublic1;
    FakeOutput3["DestKey"] = keypublic1;
    FakeOutput3["Value"] = -340;

    var ListTransactionAliceOutput = [];
    ListTransactionAliceOutput.push(AliceOutput1);
    ListTransactionAliceOutput.push(AliceOutput2);
    /*ListTransactionAliceOutput.push(FakeOutput1);
    ListTransactionAliceOutput.push(FakeOutput2);
    ListTransactionAliceOutput.push(FakeOutput3);*/

    var ListTransactionInput = [];
    var ListTransactionOutput = [];
    
    ListTransactionInput.push(ListTransactionAliceInput)
    ListTransactionOutput.push(ListTransactionAliceOutput);
    
    var dictTransaction = {};
    dictTransaction["input"] = ListTransactionInput;
    dictTransaction["output"] =  ListTransactionOutput;

    return (dictTransaction);
}

var createNewBlock2 = (BlockChain) => {
    var timestamp = 1465154725;

    var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,4);
    var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,4);
    
    var AliceInput1 = {};
    AliceInput1["KeyMaster"] = keypublic1;
    AliceInput1["Value"] = 140;
    AliceInput1["Index"] = 1;

    var ListTransactionAliceInput = [];
    ListTransactionAliceInput.push(AliceInput1);

    var AliceOutput1 = {};
    AliceOutput1["OriginKey"] = keypublic1;
    AliceOutput1["DestKey"] = keypublic1;
    AliceOutput1["Value"] = 130;
    var AliceOutput2 = {};
    AliceOutput2["OriginKey"] = keypublic1;
    AliceOutput2["DestKey"] = keypublic2;
    AliceOutput2["Value"] = 10;

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

   return (dictTransaction);
}

var createNewBlock3 = (BlockChain) => {
    var timestamp = 1465154735;

    var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,4);
    var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,4);
    
    var AliceInput1 = {};
    AliceInput1["KeyMaster"] = keypublic1;
    AliceInput1["Value"] = 130;
    AliceInput1["Index"] = 2;

    var ListTransactionAliceInput = [];
    ListTransactionAliceInput.push(AliceInput1);

    var AliceOutput1 = {};
    AliceOutput1["OriginKey"] = keypublic1;
    AliceOutput1["DestKey"] = keypublic1;
    AliceOutput1["Value"] = 120;
    var AliceOutput2 = {};
    AliceOutput2["OriginKey"] = keypublic1;
    AliceOutput2["DestKey"] = keypublic1;
    AliceOutput2["Value"] = 10;

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

    return (dictTransaction);
}
