const {clone} = require("../MinorBlock/HashTools");
var CryptoJS = require("../node_modules/crypto-js");
const {verificationSignature} = require("./SignatureAndValidation");

var checkScriptOutputValid = (ScriptOutput) => {
	var SizeOpCodeInScript = 2;
	var previousIndex = 0;
	var curentIndex = 0;

	//console.log(ScriptOutput);

	curentIndex += SizeOpCodeInScript;
	var OP_DUP = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;
	if (OP_DUP != parseInt("76", 16)){
		console.log("Not OP_DUP in ScriptOutput : " + OP_DUP);
		return false
	}

	curentIndex += SizeOpCodeInScript;
	var OP_HASH160 = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;
	if (OP_HASH160 != parseInt("a9", 16)){
		console.log("Not OP_HASH160 in ScriptOutput : " + OP_HASH160);
		return false;
	}

	curentIndex += SizeOpCodeInScript;
	var lengthHashKeyPublic = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;

	curentIndex += lengthHashKeyPublic;
	var HashKeyPublic = ScriptOutput.substring(previousIndex, curentIndex);
	previousIndex += lengthHashKeyPublic;

	curentIndex += SizeOpCodeInScript;
	var OP_EQUALVERIFY = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;
	if (OP_EQUALVERIFY != parseInt("88", 16)){
		console.log("Not OP_EQUALVERIFY in ScriptOutput : " + OP_EQUALVERIFY);
		return false;
	}

	curentIndex += SizeOpCodeInScript;
	var OP_CHECKSIG = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;
	if (OP_CHECKSIG != parseInt("ac", 16)){
		console.log("Not OP_CHECKSIG in ScriptOutput : " + OP_CHECKSIG);
		return false;
	}

	return true;

}

var scriptInput = (stack, ScriptInput) => {
	var previousIndex = 0;
	var curentIndex = 0;
	var SizeLengthInScript = 2;

	curentIndex += SizeLengthInScript;
	var lengthSignR = parseInt(ScriptInput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeLengthInScript;

	curentIndex += lengthSignR;
	var signR = ScriptInput.substring(previousIndex, curentIndex);
	previousIndex += lengthSignR;

	curentIndex += SizeLengthInScript;
	var lengthSignS = parseInt(ScriptInput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeLengthInScript;

	curentIndex += lengthSignS;
	var signS = ScriptInput.substring(previousIndex, curentIndex);
	previousIndex += lengthSignS;

	curentIndex += SizeLengthInScript;
	var lengthPublicKeyX = parseInt(ScriptInput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeLengthInScript;

	curentIndex += lengthPublicKeyX;
	var publicKeyX = ScriptInput.substring(previousIndex, curentIndex);
	previousIndex += lengthPublicKeyX;

	curentIndex += SizeLengthInScript;
	var lengthPublicKeyY = parseInt(ScriptInput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeLengthInScript;
	
	curentIndex += lengthPublicKeyX;
	var publicKeyY = ScriptInput.substring(previousIndex);
	previousIndex += lengthPublicKeyX;

	stack.push(signR);
	stack.push(signS);

	var publicKey = [publicKeyX, publicKeyY];
	stack.push(publicKey);

	//console.log(stack);
}

var scriptOutput = (stack, ScriptOutput, NameClient, Value) => {
	var SizeOpCodeInScript = 2;
	var previousIndex = 0;
	var curentIndex = 0;

	curentIndex += SizeOpCodeInScript;
	var OP_DUP = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;
	/*if (OP_DUP != parseInt("76", 16)){
		console.log("Not OP_DUP in ScriptOutput : " + OP_DUP);
		return false
	}*/

	var tmpKeyPublic = stack.pop();
	stack.push(tmpKeyPublic);
	stack.push(tmpKeyPublic);

	curentIndex += SizeOpCodeInScript;
	var OP_HASH160 = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;
	/*if (OP_HASH160 != parseInt("a9", 16)){
		console.log("Not OP_HASH160 in ScriptOutput : " + OP_HASH160);
		return false;
	}*/

	var tmpKeyPublic = stack.pop();
	//console.log("Key public : " + tmpKeyPublic);
	stack.push(CryptoJS.SHA256((tmpKeyPublic)).toString());

	curentIndex += SizeOpCodeInScript;
	var lengthHashKeyPublic = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;

	curentIndex += lengthHashKeyPublic;
	var HashKeyPublic = ScriptOutput.substring(previousIndex, curentIndex);
	previousIndex += lengthHashKeyPublic;

	stack.push(HashKeyPublic);

	curentIndex += SizeOpCodeInScript;
	var OP_EQUALVERIFY = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;
	/*if (OP_EQUALVERIFY != parseInt("88", 16)){
		console.log("Not OP_EQUALVERIFY in ScriptOutput : " + OP_EQUALVERIFY);
		return false;
	}*/

	var HashKeyPublic1 = stack.pop();
	var HashKeyPublic2 = stack.pop();

	if (HashKeyPublic1 != HashKeyPublic2){
		console.log("ErrorScript HashKeypublic different : " + HashKeyPublic1 + " " + HashKeyPublic2);
		return false;
	}

	curentIndex += SizeOpCodeInScript;
	var OP_CHECKSIG = parseInt(ScriptOutput.substring(previousIndex, curentIndex), 16);
	previousIndex += SizeOpCodeInScript;
	/*if (OP_CHECKSIG != parseInt("ac", 16)){
		console.log("Not OP_CHECKSIG in ScriptOutput : " + OP_CHECKSIG);
		return false;
	}*/

	var KeyPublic = stack.pop();
	var signS = stack.pop();
	var signR = stack.pop();
	var signature = {};
	signature["r"] = signR;
	signature["s"] = signS;
	var txns = {};
	txns["KeyMaster"] = KeyPublic;
    txns["Value"] = Value;
   	
   	/*
    console.log("ScriptValid : txns :");
    console.log(txns);
    console.log("KeyPublic : ");
    console.log(KeyPublic);
    console.log(" signature : ");
    console.log(signature);
	*/
	
	if (!verificationSignature(txns, signature, KeyPublic)){
		console.log("Error Signature : r - " + signature["r"] + " s - " + signature["s"]);
		return false;
	}
	else{
		//console.log("Valid Signature : r - " + signature["r"] + " s - " + signature["s"]);
		return true;
	}
}

var scriptValid = (ScriptInput, ScriptOutput, NameClient, Value) => {
	var stack = [];
	
	//console.log(ScriptOutput);
	//console.log(ScriptInput);
	
	scriptInput(stack, ScriptInput);
	if (!scriptOutput(stack, ScriptOutput, NameClient, Value)){
		console.log("The ScriptInput is not good : id " + NameClient + " => Lock Money");
		return false;
	}
	console.log("The ScriptInput is good : id " + NameClient + " => Unlock Money");

	return true;
}

exports.scriptValid = scriptValid;
exports.checkScriptOutputValid = checkScriptOutputValid;