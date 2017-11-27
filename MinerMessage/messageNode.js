var MessageType = require("../Constants/constant.js");
var tool = require("../MinerBlock/ClassBlock");

var parseMessage = (message) => {
	/* We use only the data, not the type */
	message = message.data.replace(/\\"/g, '"');
	message = JSON.parse(message);
	if (Array.isArray(message)){
		message = message[0];
	}
	console.log("----------------");
	console.log("Received New Block");
	console.log(message);
	console.log("----------------");
	/* message is a list so we return the first element which is our object */
	return message["block"];
}

var sendMyPortSocket = (portSocket) => ({
	'type': MessageType.SEND_MY_PORT,
	'data': JSON.stringify(portSocket)
});
var sendPeers = (ListSockets) => ({
	'type': MessageType.PEERS,
	'data': JSON.stringify(ListSockets)
});
var queryChainLengthMsg = () => ({'type': MessageType.QUERY_LATEST});
var queryAllMsg = () => ({'type': MessageType.QUERY_ALL});

var responseChainMsg = (BlockChain) =>({
    'type': MessageType.RESPONSE_BLOCKCHAIN, 'data': JSON.stringify(BlockChain)
});

var responseLatestMsg = (BlockChain) => ({
    'type': MessageType.RESPONSE_BLOCKCHAIN,
    'data': JSON.stringify([tool.getLatestBlock(BlockChain)])
});

var findProofMsg = (block) => ({
    'type' : MessageType.FIND_PROOF,
    'data' : JSON.stringify({'block' : block})
});

var write = (ws, message) => ws.send(JSON.stringify(message));
var broadcast = (sockets, message) => sockets.forEach(socket => write(socket, message));

exports.parseMessage = parseMessage;
exports.queryChainLengthMsg = queryChainLengthMsg;
exports.queryAllMsg = queryAllMsg;
exports.responseChainMsg = responseChainMsg;
exports.responseLatestMsg = responseLatestMsg;
exports.findProofMsg = findProofMsg;
exports.write = write;
exports.broadcast = broadcast;
exports.sendPeers = sendPeers;
exports.sendMyPortSocket = sendMyPortSocket;
