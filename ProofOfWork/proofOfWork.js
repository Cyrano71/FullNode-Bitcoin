var CryptoJS = require("../node_modules/crypto-js");
var express = require("../node_modules/express");
var Constants = require('../Constants/constant.js');
//const {getZero} = require("../MinorBlock/HashTools");

//return new Array(Constants.NUMBER_ZERO + 1).join("0");
/*
var getZero = () => {
    return new Array(Constants.NUMBER_ZERO + 1).join("0");
};
*/

var proofOfWorkFunction = (previoushash, actualhash, numberZero) => {
    var Found = false;
    var proof = 1;
    var solution = 0;

    while (Found == false) {
        solution = CryptoJS.SHA256(actualhash + previoushash + proof).toString();
        if (solution.startsWith(numberZero)) {
            Found = true;
            break;
        }
        proof += 1;
    }
    console.log("----------------");
    console.log('Proof of work Find : ' + solution.substring(0 , Constants.NUMBER_ZERO + 8));
    console.log("Nonce worth : " + proof);
    //console.log("previosu hash : " + previoushash);
    //console.log("actual hash : " + actualhash);
    console.log("----------------");
    return proof;
};

process.on('message', (hash) => {
    process.send(proofOfWorkFunction(hash["previousHash"], hash["myNewBlockHash"], hash["numberZero"]));
    process.exit(0);
});
process.on('close', (code, signal) => {
  console.log('child process terminated due to receipt of signal ${signal}');
});
process.on('SIGINT', () => {
  console.log('Received SIGTERM');
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  process.exit(0);
});
/*
process.on('SIGKILL', () => {
  console.log('Received SIGKILL');
  process.exit(0);
});
*/

/*
 { block: 
   { index: 2,
     previousHash: 'eb41d3d3dc517115c1c32073e9998c529bc5d0bc5e11fb189cbba8a95c79c935',
     timestamp: 1507372929,
     nonce: 5614,
     txnCount: 4,
     txns: [ [Object], [Object], [Object], [Object] ],
     state: { '3bc': 51, cd9: 49 },
     hash: 'df1513d2fe0f73520ec697d4d63dc27862b5e891c1e4a7c4cf49701983cb526a' } }
*/

/*
var previousHash = 'eb41d3d3dc517115c1c32073e9998c529bc5d0bc5e11fb189cbba8a95c79c935';
var newHash = 'df1513d2fe0f73520ec697d4d63dc27862b5e891c1e4a7c4cf49701983cb526a';
var nonce = 5614;
console.log(CryptoJS.SHA256(newHash + previousHash + nonce).toString());
*/

/*
var bodyParser = require('../node_modules/body-parser');
var WebSocket = require("../node_modules/ws");
const {calculateHash} = require("../MinorBlock/HashTools");

var timestamp = 1507372939;
var index = 2;

var listTransaction = [];
var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,3);
var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,3);
var dictTransaction = {};
var state = {};
dictTransaction[keypublic1.toString()] = 3;
dictTransaction[keypublic2.toString()] = -3;
listTransaction.push(dictTransaction); 
state[keypublic1] = 50;
state[keypublic2] = 50;

lasthash = "822a5ddd0844bcaff40ffde6544492e3f335fec95e2dd2963cbb5d05cd334bc5";

console.log("last hash : " + lasthash);
var actuelhash = calculateHash(index, lasthash, timestamp, listTransaction)
console.log("actuel hash : " + actuelhash);
console.log(proofOfWorkFunction(lasthash, actuelhash));

//actualhash = 833650b2f134e3df8d78293b5b2585644617eb6555166f24c31587dcf1f5712d
//lasthash = 822a5ddd0844bcaff40ffde6544492e3f335fec95e2dd2963cbb5d05cd334bc5
//nonce = 1287 */
