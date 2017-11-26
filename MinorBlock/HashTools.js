var Constants = require("../Constants/constant");
var CryptoJS = require("../node_modules/crypto-js");
var mutexify = require('../node_modules/mutexify');
var lock = mutexify();

var getZero = (NumberZero) => {
    return new Array(NumberZero + 1).join("0");
};

var clone = (obj) => {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
};

var calculateHash = (index, previousHash, timestamp, merkelTreeHash) => {
    var hash0 = CryptoJS.SHA256(index + previousHash + timestamp + merkelTreeHash).toString();
    return hash0.toString();
};

var calculateHashForBlockChain = (blockchain) => {
    var totalHash = 0;
    var len = blockchain.length;
    lock(function(release){  
        while (blockchain[len - 1].previousHash != "0") {
            totalHash += calculateHashForBlock(blockchain[len - 1]);
            len--;
        }
        totalHash += calculateHashForBlock(blockchain[0]);
        release();
    });
    return CryptoJS.SHA256(totalHash.toString()).toString();
}

var calculateHashForBlock = (block) => {
    if (typeof(block.index) != "number" || typeof(block.previousHash) != "string"
        || typeof(block.timestamp) != "number" || typeof(block.txns) != "object"){
        console.log("Error type arg Hash");
        exit(0)
    }
    return calculateHash(block.index, block.previousHash, block.timestamp, block.merkelTree);
};


/*
var createKey = () => {
   

}

var createPrivateKey = () => {
    var PrivateKey = 12345678;
    return PrivateKey;
}

var createGenerator = () => {
    var y = 0;
    var x = 0;
    var n = 100000000;
    var Generator = {};

    while (Math.pow(y, 2) != ((Math.pow(x, 3) + 7) % n){
        y++;
        x++;
    }

    Generator["x"] = x;
    Generator["y"] = y;

    return Generator;
}

var createPublicKey = (PrivateKey, Generator) => {

}

exports.createKey = createKey;
*/



exports.clone = clone;
exports.calculateHash = calculateHash;
exports.getZero = getZero;
exports.calculateHashForBlockChain = calculateHashForBlockChain;
exports.calculateHashForBlock = calculateHashForBlock;