var CryptoJS = require("../node_modules/crypto-js");
const {ALICE} = require("../Constants/constant");
const {BOB} = require("../Constants/constant");
const {ALICETOBOB} = require("../Constants/constant");
const {ALICETOALICE} = require("../Constants/constant");
const {BOBTOBOB}  = require("../Constants/constant");
const {BOBTOALICE} = require("../Constants/constant");
const {HASHKEYPUBLICBOB} = require("../Constants/constant");
const {HASHKEYPUBLICALICE} = require("../Constants/constant");
const {SCRIPTOUTPUT} = require("../Constants/constant");
const {SCRIPTINPUT} = require("../Constants/constant");

const {createKeyPair} = require("./SignatureAndValidation");
const {signTransaction} = require("./SignatureAndValidation");
const {verificationSignature} = require("./SignatureAndValidation");

var createAliceAndBobKey = (dictKey) => {
  /*
    { '0': 
   { PublicKey: 
      [ '74902224488826910232085002394257988863306420152538940914508498959529124263155',
        '54735445204747581055487271024388007249667670763554945030637103963531009463654' ],
     PrivateKey: '61459885929721151633601005596116558313295841787215522628960037757084091525499' },
  '1': 
   { PublicKey: 
      [ '43293739094468104778068897805444400635677970061930785251247847889724639922579',
        '44217092976759542144349631023546351438644308223246915838298002054156081901115' ],
     PrivateKey: '64499252254785052715622257166355993942798139690202127370193583541680030364892' },
  '6': '4ea5c508a6566e76240543f8feb06fd457777be39549c4016436afda65d2330e',
  '7': '4ea5c508a6566e76240543f8feb06fd457777be39549c4016436afda65d2330e' }
  */

    /*
    var KeyPairAlice = createKeyPair();
    var KeyPairBob = createKeyPair();
    dictKey[ALICE] = KeyPairAlice;
    dictKey[BOB] = KeyPairBob;
    */

    dictKey[ALICE] = { "PublicKey": 
      [ '74902224488826910232085002394257988863306420152538940914508498959529124263155',
        '54735445204747581055487271024388007249667670763554945030637103963531009463654' ],
     "PrivateKey": '61459885929721151633601005596116558313295841787215522628960037757084091525499' }
    dictKey[BOB] = { "PublicKey": 
      [ '43293739094468104778068897805444400635677970061930785251247847889724639922579',
        '44217092976759542144349631023546351438644308223246915838298002054156081901115' ],
     "PrivateKey" : '64499252254785052715622257166355993942798139690202127370193583541680030364892' }
}

var createScriptInput = (client, dictScript, dictKey, valueInput) => {
    createAliceAndBobKey(dictKey);

    var KeyPairAlice = dictKey[ALICE]
    var KeyPairBob = dictKey[BOB]; 

    var keypublicAlice = KeyPairAlice["PublicKey"];
    var keypublicBob = KeyPairBob["PublicKey"];

    var signatureAlice = undefined;
    var signatureBob = undefined;
    var txnsInput = {};

    if (client == ALICE){
        txnsInput["KeyMaster"] = keypublicAlice;
        txnsInput["Value"] = valueInput;
        //console.log(KeyPairAlice);
        //console.log(txnsInput);
        signatureAlice = signTransaction(txnsInput,  KeyPairAlice);

        //console.log(signatureAlice);
        var LengthSignatureAliceR = signatureAlice["r"].length.toString(16);
        if (LengthSignatureAliceR.length == 1){
            LengthSignatureAliceR = "".concat("0", LengthSignatureAliceR);
        }

        var LengthSignatureAliceS = signatureAlice["s"].length.toString(16);
        if (LengthSignatureAliceS.length == 1){
            LengthSignatureAliceR = "".concat("0", LengthSignatureAliceS);
        }

        var LengthKeyPublicAliceX = keypublicAlice[0].length.toString(16);
        if (LengthKeyPublicAliceX.length == 1){
            LengthKeyPublicAliceX = "".concat("0", LengthKeyPublicAliceX);
        }

        var LengthKeyPublicAliceY = keypublicAlice[1].length.toString(16);
        if (LengthKeyPublicAliceY.length == 1){
            LengthKeyPublicAliceY = "".concat("0", LengthKeyPublicAliceY);
        }

        var ScriptInputAlice = LengthSignatureAliceR + signatureAlice["r"] 
                                + LengthSignatureAliceS + signatureAlice["s"]
                                + LengthKeyPublicAliceX + keypublicAlice[0]
                                + LengthKeyPublicAliceY + keypublicAlice[1];
    
        dictScript[ALICE] = ScriptInputAlice;
    }
    else if (client == BOB){
        txnsInput["KeyMaster"] = keypublicBob;
        txnsInput["Value"] = valueInput;
        //console.log("Txns :");
        //console.log(txnsInput);
        signatureBob = signTransaction(txnsInput,  KeyPairBob);
        /*
        console.log(txnsInput);
        console.log(keypublicBob);
        console.log(signatureBob);
        */

        var LengthSignatureBobR = signatureBob["r"].length.toString(16);
        if (LengthSignatureBobR.length == 1){
            LengthSignatureBobR = "".concat("0",LengthSignatureBobR)
        }

        var LengthSignatureBobS = signatureBob["s"].length.toString(16);
        if (LengthSignatureBobS.length == 1){
            LengthSignatureBobS = "".concat("0",LengthSignatureBobS)
        }

        var LengthKeyPublicBobX = keypublicBob[0].length.toString(16);
        if (LengthKeyPublicBobX.length == 1){
            LengthKeyPublicBobX = "".concat("0", LengthKeyPublicBobX);
        }

        var LengthKeyPublicBobY = keypublicBob[1].length.toString(16);
        if (LengthKeyPublicBobY.length == 1){
            LengthKeyPublicBobY = "".concat("0", LengthKeyPublicBobY);
        }

        /* Test if you change signature
        signatureBob["s"] =signatureBob["s"].replace(/^.{2}/g, 'rr');
        console.log(signatureBob["s"]);
        */

        var ScriptInputBob = LengthSignatureBobR + signatureBob["r"]
                            +  LengthSignatureBobS + signatureBob["s"]
                            + LengthKeyPublicBobX + keypublicBob[0]
                            + LengthKeyPublicBobY + keypublicBob[1];
        
        dictScript[BOB] = ScriptInputBob;
    }
    else {
        console.log("Error unknow type : " + type + " in createScript ");
    }

   
}

var createScriptOutput = (dictScript, dictKey) => {
    var KeyPairAlice = dictKey[ALICE]
    var KeyPairBob = dictKey[BOB]; 

    var keypublicAlice = KeyPairAlice["PublicKey"];
    var keypublicBob = KeyPairBob["PublicKey"];

    var HashKeyPublicAlice = CryptoJS.SHA256((keypublicAlice)).toString(); //.substring(0,4);
    var HashKeyPublicBob = CryptoJS.SHA256((keypublicBob)).toString(); //.substring(0,4);
    
    dictKey[HASHKEYPUBLICALICE] = HashKeyPublicAlice;
    dictKey[HASHKEYPUBLICBOB] = HashKeyPublicBob;

    var LengthHashKeyAlice = HashKeyPublicAlice.length.toString(16);
    if (LengthHashKeyAlice.length == 1){
        LengthHashKeyAlice = "".concat("0",LengthHashKeyAlice);
    }
    var LengthHashKeyBob = HashKeyPublicBob.length.toString(16);
    if (LengthHashKeyBob.length == 1){
        LengthHashKeyBob = "".concat("0",LengthHashKeyBob);
    }

    var prependScript = "76a9";
    var appendScript = "88ac";

    var ScriptAliceToAlice = prependScript + LengthHashKeyAlice + HashKeyPublicAlice + appendScript;
    var ScriptAliceToBob = prependScript + LengthHashKeyBob + HashKeyPublicBob + appendScript;

    var ScriptBobToBob = prependScript + LengthHashKeyBob + HashKeyPublicBob + appendScript;
    var ScriptBobToAlice =  prependScript + LengthHashKeyAlice + HashKeyPublicAlice + appendScript;
    
   
    dictScript[ALICETOALICE] = ScriptAliceToAlice;
    dictScript[ALICETOBOB] = ScriptAliceToBob;
    
    dictScript[BOBTOBOB] = ScriptBobToBob;
    dictScript[BOBTOALICE] = ScriptBobToAlice;
}

var creationTxnsInput = (client, valueInput, index, dictScript, dictKey) => {
    var txnsInput = {}
    
    if (client == ALICE){
        txnsInput["KeyMaster"] = dictKey[ALICE]["PublicKey"]; //dictKey[ALICE];
        txnsInput["Value"] = valueInput;
        txnsInput["Index"] = index;
        txnsInput["Script"] = dictScript[ALICE];
    }
    else if (client == BOB){
    	txnsInput["KeyMaster"] = dictKey[BOB]["PublicKey"]; //dictKey[BOB];
        txnsInput["Value"] = valueInput;
        txnsInput["Index"] = index;
        txnsInput["Script"] = dictScript[BOB];
    }
    else{
        console.log("Error creationTxnsInput unknown client : " + client);
    }

    return txnsInput;
}

var creationTxnsOutput = (type, valueOutput, dictScript, dictKey) => {
    var txnsOutput = {};

    if (type == ALICETOALICE){
        txnsOutput["OriginKey"] = dictKey[ALICE]["PublicKey"] //dictKey[ALICE];
        txnsOutput["DestKey"] = dictKey[ALICE]["PublicKey"] //dictKey[ALICE];
        txnsOutput["Value"] = valueOutput;
        txnsOutput["Script"] = dictScript[ALICETOALICE];
    }
    else if (type == ALICETOBOB){
        txnsOutput["OriginKey"] = dictKey[ALICE]["PublicKey"]//dictKey[ALICE];
        txnsOutput["DestKey"] = dictKey[BOB]["PublicKey"]//dictKey[BOB];
        txnsOutput["Value"] = valueOutput;
        txnsOutput["Script"] = dictScript[ALICETOBOB];
    }
    else if (type == BOBTOBOB){
    	txnsOutput["OriginKey"] = dictKey[BOB]["PublicKey"]//dictKey[BOB];
        txnsOutput["DestKey"] = dictKey[BOB]["PublicKey"]//dictKey[BOB];
        txnsOutput["Value"] = valueOutput;
        txnsOutput["Script"] = dictScript[BOBTOBOB];
    }
    else if (type == BOBTOALICE){
        txnsOutput["OriginKey"] = dictKey[BOB]["PublicKey"]//dictKey[BOB];
        txnsOutput["DestKey"] = dictKey[ALICE]["PublicKey"]//dictKey[BOB];
        txnsOutput["Value"] = valueOutput;
        txnsOutput["Script"] = dictScript[BOBTOALICE];
    }
    else{
        console.log("Error creationTxnsoutput unknown type : " + type);
    }

    return txnsOutput;

}

var createFakeInput = (number) => {
    if (number == 1){
        /*
        No enough Money in Wallet
        */
        var FakeInput1 = {};
        FakeInput1["KeyMaster"] = keypublic1;
        FakeInput1["Value"] = 350;
        FakeInput1["Index"] = 0;
        return FakeInput1;
    }
    else if (number == 2){
        /*
        Negative Value
        */
        var FakeInput2 = {};
        FakeInput2["KeyMaster"] = keypublic1;
        FakeInput2["Value"] = -50;
        FakeInput2["Index"] = 0;
        return FakeInput2;
    }
    else if (number == 3){
    	 var FakeInput3 = {};
        FakeInput3["KeyMaster"] = "fake key";
        FakeInput3["Value"] = 50;
        FakeInput3["Index"] = 3;
        return FakeInput3;
    }
}

var createFakeOutput = (number) => {

    if (number == 1){
          /*
        
        The Key doesn't exist
        */
        var FakeOutput1 = {};
        FakeOutput1["OriginKey"] = "fake1";
        FakeOutput1["DestKey"] = keypublic1;
        FakeOutput1["Value"] = 140;
        return FakeOutput1;
    }
    else if (number == 2){

        /*
        The key exists but not enough money
        */
        var FakeOutput2 = {};
        FakeOutput2["OriginKey"] =  keypublic1;
        FakeOutput2["DestKey"] = keypublic1;
        FakeOutput2["Value"] = 340;
        return FakeOutput2;
    }
    else if (number == 3){
        /*
        Value <= 0
        */
        var FakeOutput3 = {};
        FakeOutput3["OriginKey"] =  keypublic1;
        FakeOutput3["DestKey"] = keypublic1;
        FakeOutput3["Value"] = -340;
        return FakeOutput3;
    }

}

var creationTransactionInput = (client, dictScript, dictKey, valueInput, index) => {
    createScriptInput(client, dictScript, dictKey, valueInput);
    return creationTxnsInput(client, valueInput, index, dictScript, dictKey);
}

var creationTransactionOutput = (typeTransaction, dictScript, dictKey, valueOutput) => {
    createScriptOutput(dictScript, dictKey);
    return creationTxnsOutput(typeTransaction, valueOutput, dictScript, dictKey);
}

exports.creationTransactionInput = creationTransactionInput;
exports.creationTransactionOutput = creationTransactionOutput;
exports.createFakeInput = createFakeInput;
exports.creationTxnsOutput = creationTxnsOutput;
exports.creationTxnsInput = creationTxnsInput;
exports.createScriptInput= createScriptInput;
exports.createScriptOutput = createScriptOutput;

/*
var dictKey = {};
var dictScript = {};

var client = ALICE;
var typeTransaction = ALICETOBOB;
var valueInput = 150;
var valueOutput = 150;
var index = 1;

//console.log(dictKey);
//createScriptInput(ALICE, dictScript, dictKey, valueInput);
   // var txnsInput = creationTxnsInput(ALICE, valueInput, index, dictScript, dictKey);
//createScriptOutput(dictScript, dictKey);
//var txnsOutput = creationTxnsOutput(ALICETOALICE, valueOutput, dictScript, dictKey);
//console.log(txnsInput);
//console.log(txnsOutput);

var txnsInput = creationTransactionInput(client, dictScript, dictKey, valueInput, index)
var txnsOutput = creationTransactionOutput(typeTransaction, dictScript, dictKey, valueOutput);

const {checkScriptOutputValid} = require("./checkScript");
const {scriptValid} = require("./checkScript");

//console.log("txnsInput : ");
//console.log(txnsInput);
//console.log("txnsOutput : ");
//console.log(txnsOutput);

//console.log(checkScriptOutputValid(txnsOutput["Script"]));
scriptValid(txnsInput["Script"], txnsOutput["Script"], "BOB", valueInput);
*/

 /*
    var keypublicAlice = CryptoJS.SHA256("Alice").toString().substring(0,4);
    var keypublicBob = CryptoJS.SHA256("Bob").toString().substring(0,4);
    */

    /*
    dictKey[ALICE] = keypublicAlice;
    dictKey[BOB] = keypublicBob;
    */

    /*
    var LengthKeyPublicALice = keypublicAlice.length.toString(16);
    if (LengthKeyPublicALice.length == 1){
        LengthKeyPublicALice = "".concat("0",LengthKeyPublicALice)
    }

    var LengthKeyPublicBob = keypublicBob.length.toString(16);
    if (LengthKeyPublicBob.length == 1){
        LengthKeyPublicBob = "".concat("0",LengthKeyPublicBob)
    }
    */

 /*
    var keypublicAlice = CryptoJS.SHA256("Alice").toString().substring(0,4);
    var keypublicBob = CryptoJS.SHA256("Bob").toString().substring(0,4);
    */

    /*
    dictKey[ALICE] = keypublicAlice;
    dictKey[BOB] = keypublicBob;
    */

    /*
    var LengthKeyPublicALice = keypublicAlice.length.toString(16);
    if (LengthKeyPublicALice.length == 1){
        LengthKeyPublicALice = "".concat("0",LengthKeyPublicALice)
    }

    var LengthKeyPublicBob = keypublicBob.length.toString(16);
    if (LengthKeyPublicBob.length == 1){
        LengthKeyPublicBob = "".concat("0",LengthKeyPublicBob)
    }
    */

    /*
    var HashKeyPublicAlice = CryptoJS.SHA256((keypublicAlice)).toString(); //.substring(0,4);
    var HashKeyPublicBob = CryptoJS.SHA256((keypublicBob)).toString(); //.substring(0,4);
    
    dictKey[HASHKEYPUBLICALICE] = HashKeyPublicAlice;
    dictKey[HASHKEYPUBLICBOB] = HashKeyPublicBob;

    var LengthHashKeyAlice = HashKeyPublicAlice.length.toString(16);
    if (LengthHashKeyAlice.length == 1){
        LengthHashKeyAlice = "".concat("0",LengthHashKeyAlice);
    }
    var LengthHashKeyBob = HashKeyPublicBob.length.toString(16);
    if (LengthHashKeyBob.length == 1){
        LengthHashKeyBob = "".concat("0",LengthHashKeyBob);
    }
    */


    /*
    var keypublicAlice = KeyPairAlice["PublicKey"];
    var keypublicBob = KeyPairBob["PublicKey"];
    */

    /*
    var keypublicAlice = CryptoJS.SHA256("Alice").toString().substring(0,4);
    var keypublicBob = CryptoJS.SHA256("Bob").toString().substring(0,4);
    */

    /*
    dictKey[ALICE] = keypublicAlice;
    dictKey[BOB] = keypublicBob;
    */

    /*
    var LengthKeyPublicALice = keypublicAlice.length.toString(16);
    if (LengthKeyPublicALice.length == 1){
        LengthKeyPublicALice = "".concat("0",LengthKeyPublicALice)
    }

    var LengthKeyPublicBob = keypublicBob.length.toString(16);
    if (LengthKeyPublicBob.length == 1){
        LengthKeyPublicBob = "".concat("0",LengthKeyPublicBob)
    }

    var HashKeyPublicAlice = CryptoJS.SHA256((keypublicAlice).toString().substring(0,4);
    var HashKeyPublicBob = CryptoJS.SHA256((keypublicBob).toString().substring(0,4);
    
    dictKey[HASHKEYPUBLICALICE] = HashKeyPublicAlice;
    dictKey[HASHKEYPUBLICBOB] = HashKeyPublicBob;

    var LengthHashKeyAlice = HashKeyPublicAlice.length.toString(16);
    if (LengthHashKeyAlice.length == 1){
        LengthHashKeyAlice = "".concat("0",LengthHashKeyAlice)
    }
    var LengthHashKeyBob = HashKeyPublicBob.length.toString(16);
    if (LengthHashKeyBob.length == 1){
        LengthHashKeyBob = "".concat("0",LengthHashKeyBob);
    }
    
    var signatureAlice = "Alice";
    var LengthSignatureAlice = signatureAlice.length.toString(16);
    if (LengthSignatureAlice.length == 1){
         LengthSignatureAlice = "".concat("0", LengthSignatureAlice)
    }

    var signatureBob = "Bob";
    var LengthSignatureBob = signatureBob.length.toString(16);
    if (LengthSignatureBob.length == 1){
        LengthSignatureBob = "".concat("0",LengthSignatureBob)
    }
    */