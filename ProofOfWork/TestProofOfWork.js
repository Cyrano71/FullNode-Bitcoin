/*
var bodyParser = require('../node_modules/body-parser');
var WebSocket = require("../node_modules/ws");
const {calculateHash} = require("../MinorBlock/toolsBlock");

var timestamp = 1507234220;
var index = 2;
var listTransaction = [];
var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,3);
var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,3);
var dictTransaction = {};
var state = {};
dictTransaction[keypublic1.toString()] = 9;
dictTransaction[keypublic2.toString()] = -9;
listTransaction.push(dictTransaction); 
state[keypublic1] = 50;
state[keypublic2] = 50;
lasthash = "7a6283bc7ea2c93abde9b8cd9552b9cc7c01f496a33fcaa911169b57fa3e71a0";
console.log("last hash : " + lasthash);
var actuelhash = calculateHash(index, lasthash, timestamp, listTransaction)
console.log("actuel hash : " + actuelhash);
console.log(proofOfWorkFunction(lasthash, actuelhash));
*/

//notice you have to change significantly the value to have a new hash
// actualhash = 131c7acac3bbcacff6099b81ad14b72912a8eb2b7095c7f6a9f9879936eaa730
// lasthash = "7a6283bc7ea2c93abde9b8cd9552b9cc7c01f496a33fcaa911169b57fa3e71a0"
// nonce = 1820

/*
var bodyParser = require('../node_modules/body-parser');
var WebSocket = require("../node_modules/ws");
const {calculateHash} = require("../MinorBlock/toolsBlock");

var timestamp = 1507234188;
var index = 2;
var listTransaction = [];
var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,3);
var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,3);
var dictTransaction = {};
var state = {};
dictTransaction[keypublic1.toString()] = 8;
dictTransaction[keypublic2.toString()] = -8;
listTransaction.push(dictTransaction); 
state[keypublic1] = 50;
state[keypublic2] = 50;
lasthash = "777c04182c0090cd7ff450169ff52d4a10917cca6f1af84353da6031bbfb516c";
console.log("last hash : " + lasthash);
var actuelhash = calculateHash(index, lasthash, timestamp, listTransaction)
console.log("actuel hash : " + actuelhash);
console.log(proofOfWorkFunction(lasthash, actuelhash));
*/

//notice you have to change significantly the value to have a new hash
// actualhash = ab2b206ea2a7301972e62d59c3cbe6c053bcd2637c6df92d83ed137f592eced7
// lasthash = 777c04182c0090cd7ff450169ff52d4a10917cca6f1af84353da6031bbfb516c
// nonce = 877

/*
var bodyParser = require('../node_modules/body-parser');
var WebSocket = require("../node_modules/ws");
const {calculateHash} = require("../MinorBlock/toolsBlock");

var timestamp = 1507234186.921;
var listTransaction = [];
var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,3);
var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,3);
var dictTransaction = {};
var state = {};
dictTransaction[keypublic1.toString()] = 7;
dictTransaction[keypublic2.toString()] = -7;
listTransaction.push(dictTransaction); 
state[keypublic1] = 50;
state[keypublic2] = 50;
lasthash = "4001c3ae567b0f8002d10d627a6295002084016de33db5f32bd70f43330202de";
actuelhash = calculateHash(2, lasthash, timestamp, listTransaction);
console.log("actuel hash : " + actuelhash.toString());
console.log(proofOfWorkFunction(lasthash, actuelhash));
*/

// actualhash = 777c04182c0090cd7ff450169ff52d4a10917cca6f1af84353da6031bbfb516c
// lasthash = 4001c3ae567b0f8002d10d627a6295002084016de33db5f32bd70f43330202de
// nonce = 10196

/*
var bodyParser = require('../node_modules/body-parser');
var WebSocket = require("../node_modules/ws");
const {calculateHash} = require("../MinorBlock/toolsBlock");

var timestamp = 1507234186.925;
console.log(timestamp);
var listTransaction = [];
var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,3);
var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,3);
var dictTransaction = {};
var state = {};
dictTransaction[keypublic1.toString()] = 1;
dictTransaction[keypublic2.toString()] = -1;
listTransaction.push(dictTransaction); 
console.log(listTransaction);
//console.log(listTransaction[0]["3bc"]);
//console.log(listTransaction[0]["cd9"]);
//6bd8490c9d143d05da6d626c64cb90f443778faffc3ff1848ba327d97623deb3
state[keypublic1] = 50;
state[keypublic2] = 50;
lasthash = '7a6283bc7ea2c93abde9b8cd9552b9cc7c01f496a33fcaa911169b57fa3e71a0';
//calculateHash(block.index, block.previousHash, block.timestamp, block.txns);
actuelhash = calculateHash(2, lasthash, timestamp, listTransaction);
console.log("actuel hash : " + actuelhash.toString());
console.log(proofOfWorkFunction(lasthash, actuelhash));
//lasthash = 7a6283bc7ea2c93abde9b8cd9552b9cc7c01f496a33fcaa911169b57fa3e71a0;
//actuel hash : e79e0bc026d4b0f7ba75dc38c4b9a075c00be27a5084b9b4835bf545a873761e
//nonce = 1923
*/

/*
var bodyParser = require('body-parser');
var WebSocket = require("ws");
const {calculateHash} = require("./MinorBlock/toolsBlock");

var timestamp = 1465154705 + 10;
console.log(timestamp);
var listTransaction = [];
var keypublic1 = CryptoJS.SHA256("Alice").toString().substring(0,3);
var keypublic2 = CryptoJS.SHA256("Bob").toString().substring(0,3);
var dictTransaction = {};
var state = {};
dictTransaction[keypublic1.toString()] = 1;
dictTransaction[keypublic2.toString()] = -1;
listTransaction.push(dictTransaction); 
console.log(listTransaction);
//console.log(listTransaction[0]["3bc"]);
//console.log(listTransaction[0]["cd9"]);
//6bd8490c9d143d05da6d626c64cb90f443778faffc3ff1848ba327d97623deb3
state[keypublic1] = 50;
state[keypublic2] = 50;
lasthash = "4001c3ae567b0f8002d10d627a6295002084016de33db5f32bd70f43330202de";
//calculateHash(block.index, block.previousHash, block.timestamp, block.txns);
actuelhash = calculateHash(2, lasthash, timestamp, listTransaction);
console.log("actuel hash : " + actuelhash.toString());
console.log(proofOfWorkFunction(lasthash, actuelhash));
*/

//lasthash = 4001c3ae567b0f8002d10d627a6295002084016de33db5f32bd70f43330202de;
//actuel hash : e79e0bc026d4b0f7ba75dc38c4b9a075c00be27a5084b9b4835bf545a873761e
//nonce = 32526

/*
var timestamp = 1465154725;
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
lasthash = "e79e0bc026d4b0f7ba75dc38c4b9a075c00be27a5084b9b4835bf545a873761e";
actuelhash = calculateHash(2, lasthash, timestamp, listTransaction);
console.log("actuel hash : " + actuelhash.toString());
console.log(proofOfWorkFunction(lasthash, actuelhash));
*/

//last hash : e79e0bc026d4b0f7ba75dc38c4b9a075c00be27a5084b9b4835bf545a873761e
//actual hash = 13380302427e834d7b7da004798d7a0b7ec642460aaabf0c725f2c3addb6d14b
// nonce = 30661



//console.log("previous hash " + previoushash)
//console.log("actuel hash " + actuelhash)
    /*if (proof % 1000 == 0) {
        //    console.log("proof " + actuelhash)
        }*/