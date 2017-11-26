const {GX} = require("../Constants/constant");
const {GY} = require("../Constants/constant");
const {N} = require("../Constants/constant");
var CryptoJS = require("../node_modules/crypto-js");
const {clone} = require("../MinorBlock/HashTools");

var abs = (nb) => {
	if (nb < 0){
		return (-nb);
	}
	return nb;
}

var divmod = (a, b) => {
	return [Math.floor(a / b), a % b]
}

var mod_inverse = (a, n) => {
	
	/*Return the inverse of a mod n.

	n must be prime.

	>>> mod_inverse(42, 2017)
	1969

	*/

	var b = n
	if (abs(b) == 0) {
		return 1, 0, a;
	}

	var x1 = 0;
	var x2 = 1;
	var y1 = 1;
	var y2 = 0;
	var result = undefined;
	var q = 0;
	var r = 0;
	while (abs(b) > 0){
		result = divmod(a, b);
		q = result[0];
		r = result[1];
		//console.log("q : " + q + " r : " + r);
		x = x2 - q * x1;
		y = y2 - q * y1;
		a = b;
		b = r;
		x2 = x1;
		x1 = x;
		y2 = y1;
		y1 = y;
		//console.log("a : " + a + " b : " + b + " x2 : " + x2 + " x1 : " + x1
			//	+ " y2 : " + y2 + " y1 : " + y1);
	}
	while (x2 < 0){
		x2 = x2 + n;
	}
	return x2 % n;
}

var createKeyPair = () => {

	var KeyPair = {};

	var py = require('child_process').spawnSync('python', ["../Cryptography/createPairKey.py"]);
  	var data = py["stdout"];
  	var err = py["stderr"];
  	var StrPython = "";
  	var PublicKey = [];
  	var PrivateKey = "";

  	if (err.length != 0)
  		console.log("Error : " + err);

  	StrPython = data.toString();
  	//console.log(StrPython);
	StrPython = StrPython.replace(/"/g, "").replace(/'/g, "").replace('[','').replace(']','').replace(' ', '').replace(' ', '');
	
	//console.log(StrPython);

	var index1 = StrPython.indexOf(",");
	PublicKey.push(StrPython.substring(0, index1));
	StrPython = StrPython.slice(index1 + 1);
	var index2 = StrPython.indexOf(",");
	PublicKey.push(StrPython.substring(0, index2));
	StrPython = StrPython.slice(index2 + 1);
	var index3 = StrPython.indexOf("\n");
	StrPython = StrPython.slice(0, index3);
	PrivateKey = StrPython;
			
	KeyPair["PublicKey"] = PublicKey;
	KeyPair["PrivateKey"] = PrivateKey;
  
	//console.log(KeyPair);
	return KeyPair;

}

//KeyPair = {};
//(KeyPair);

var signTransaction = (txns,  KeyPair) => {
	//var KeyPair = {};
	//createKeyPair(KeyPair);
	//pathAbsolue = "/Users/cex/Desktop/BlockChain2/Cryptography/SignTxns.py"
	//pathRelatif = "../Cryptography/SignTxns.py"
	var signature = {};
	var r = undefined;
	var s = undefined;
	var StrPython = "";
	var py = require('child_process').spawnSync('python', ["/Users/cex/Desktop/BlockChain2/Cryptography/SignTxns.py"], { input: JSON.stringify([KeyPair, txns])}); 

	var data = py.stdout.toString();
	var err = py.stderr.toString();
	
	if (err.length != 0)
		console.log(err);
	StrPython = data.toString();
	StrPython = StrPython.replace(/"/g, "").replace(/'/g, "").replace('[','').replace(']','').replace(' ', '').replace(' ', '');
	
	var index1 = StrPython.indexOf(",");
	r = StrPython.substring(0, index1);
	s = StrPython.slice(index1 + 1).replace('\n', '');
	
	signature["r"] = r;
	signature["s"] = s;
	//var error = py.stderr.toString()

	//console.log(newdata);
	//console.log("Error" + error);
	return (signature);

}

var verificationSignature = (txns, signature, publicKey) => {

console.log("--------Verification Signature---------");
//pathRelatif =  "../Cryptography/verificationSignature.py"
//pathAbsolue = "/Users/cex/Desktop/BlockChain2/Cryptography/verificationSignature.py"
var py = require('child_process').spawnSync('python', ["/Users/cex/Desktop/BlockChain2/Cryptography/verificationSignature.py"], { input: JSON.stringify([txns, signature, publicKey])}); 
var data = py.stdout.toString();
var err = py.stderr.toString();

//console.log(data);
if (err.length != 0)
	console.log("Error : " + err);

if (data == "sign valid\n"){
	return true;
}
else {
	return false;
}

}

/*
var txns = [{"3xn" : 10, "cd9" : 15}];
var Wallet = signTransaction(txns);
console.log(verificationSignature(txns, Wallet[1], Wallet[0]["PublicKey"]));
*/

exports.createKeyPair = createKeyPair;
exports.signTransaction = signTransaction;
exports.verificationSignature = verificationSignature;
/*
var KeyPair = {};
createKeyPair(KeyPair);
console.log(KeyPair);
*/

/*
var retreiveData = undefined;

function run(callback, retreiveData) {
    var spawn = require('child_process').spawn('python', ["createPairKey.py"]);
    //var command = spawn(cmd);
    var result = '';
    spawn.stdout.on('data', function(data) {
         result += data.toString();
    });
    spawn.on('close', function(code) {
        return callback(result, retreiveData);
    });
}

console.log(run(function(result, retreiveData) { 
	retreiveData = result;
	return retreiveData;
}, retreiveData));
console.log(retreiveData);

*/

/*
var KeyPair = {};
KeyPair = createKeyPair2(KeyPair); 
console.log(KeyPair);
*/
/*
//Pubic and private Mark key
var publicKey = [29295884153131333902890903415530951506334280233959372534460762761041533360574, 112076240628578240568523181520380650571261983689535131511449248032083678639823]
var privateKey = 15314797834480058149256361204581006089885396561493866499942002001206262257146;
createNewSignature(privateKey,{"3cb" : 9, "cd9" : -5});
*/

	/*
  	python.stdout.on('data', (data) => {
			StrPython = data.toString();
			StrPython = StrPython.replace(/"/g, "").replace(/'/g, "").replace('[','').replace(']','').replace(' ', '').replace(' ', '');
			//console.log(StrPython);

			var index1 = StrPython.indexOf(",");
			PublicKey.push(StrPython.substring(0, index1));
			StrPython = StrPython.slice(index1 + 1);
			var index2 = StrPython.indexOf(",");
			PublicKey.push(StrPython.substring(0, index2));
			StrPython = StrPython.slice(index2 + 1);
			var index3 = StrPython.indexOf("\n");
			StrPython = StrPython.slice(0, index3);
			PrivateKey = StrPython;
			
			KeyPair["PublicKey"] = PublicKey;
			KeyPair["PrivateKey"] = PrivateKey;
			//console.log(KeyPair);
  			//console.log(PublicKey[0]);
  			//console.log(PublicKey[1]);
  			//console.log(PrivateKey);
			//PublicKey = JSON.parse(PublicKey);
  	});
  	python.stdout.on('end', function(){
  	
  		console.log(PublicKey);
  		console.log(PrivateKey);
  		KeyPair["PublicKey"] = PublicKey;
		KeyPair["PrivateKey"] = PrivateKey;
		
		//return KeyPair;
	});
	 python.stdout.on('close', function(){
	 	
  		console.log(PublicKey);
  		console.log(PrivateKey);
  		KeyPair["PublicKey"] = PublicKey;
		KeyPair["PrivateKey"] = PrivateKey;
		
		return KeyPair;
	});
	*/

/*
var createKeyPair2 = (KeyPair) => {
	const exec = require('child_process').execSync;

	var StrPython = undefined;
  	var PublicKey = [];
  	var PrivateKey = undefined;
	var Execute = execSync('python createPairKey.py', (e, stdout, stderr)=> {
    	if (e instanceof Error) {
        	console.error(e);
       		 throw e;
  		  }
   		//console.log('stdout ', stdout);
   		//console.log('stderr ', stderr);

    	StrPython = stdout.toString();
		StrPython = StrPython.replace(/"/g, "").replace(/'/g, "").replace('[','').replace(']','').replace(' ', '').replace(' ', '');
		//console.log(StrPython);

		var index1 = StrPython.indexOf(",");
		PublicKey.push(StrPython.substring(0, index1));
		StrPython = StrPython.slice(index1 + 1);
		var index2 = StrPython.indexOf(",");
		PublicKey.push(StrPython.substring(0, index2));
		StrPython = StrPython.slice(index2 + 1);
		var index3 = StrPython.indexOf("\n");
		StrPython = StrPython.slice(0, index3);
		PrivateKey = StrPython;
		//return afterExecution(KeyPair, PublicKey, PrivateKey);

		//console.log(KeyPair);

		//stateProcess["KeyPair"] = KeyPair;
	});
}

var afterExecution = (KeyPair, PublicKey, PrivateKey) => {
	KeyPair["PublicKey"] = clone(PublicKey);
	KeyPair["PrivateKey"] = clone(PrivateKey);
	console.log(KeyPair);

	var stateProcess = KeyPair;
	return stateProcess;
}
*/


/*
class ECDSA {
	constructor(generator, order){
		this.G = generator;
		this.n = order;
	}

	sign(msghash, privateKey){
		var msg =  parseInt(msghash, 16) //int(msghash, 16);
		var k = Math.random() * (this.n - 1) + 1; //random.randint(1, self.n - 1);
		var X =  this.G.map(x => x * k);
		var i = X[0];
		var j = X[1];
		var r = i % this.n
		var s = (mod_inverse(k, this.n) * (msg + r * privateKey)) % this.n
		console.log(s);
		return [r, s];
	}
}
*/

	/*
	var signObject = new ECDSA([GX, GY], N);
	var msghash = CryptoJS.SHA256(txns).toString();
	var sign = signObject.sign(msghash, privateKey);
	console.log(sign);
	*/

	/*, {stdio: [
    'pipe', // Use parent's stdin for child
    'pipe', // Pipe child's stdout to parent
  	'pipe']}); //, { stdio: 'pipe' }
  	*/
  	//console.log(py);
	//console.log(py.options.stdio[0]);
	//py.options.stdio[0].write('thing');
	//py.options.stdio[0].end();
	//py.stdio.write(JSON.stringify(data));