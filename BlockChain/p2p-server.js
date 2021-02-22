//Creating a peer to peer connection
const webSocket = require('ws')

//Defining the basic port
const P2P_PORT = process.env.P2P_PORT || 5000
    //peers will be a list of strings of type ws:localhost:xxxx, if not list is available return empty array

const peers = process.env.PEERS ? process.env.PEERS.split(' ') : []
const MESSAGE_TYPE = { chain: "CHAIN", transaction: "TRN", clear: "CLEAR" }

class P2pServer {
    //socket array and blockchain initialization
    constructor(blockchain, trn_pool) {
        this.blockchain = blockchain
        this.transactionPool = trn_pool
        this.sockets = []
    }
    listen() {
        //creates a server instance for each peer
        const server = new webSocket.Server({ port: P2P_PORT })
            //waits for the connection and establishes it
        server.on('connection', socket => this.connectSocket(socket))
            //connects to all available peers
        this.connectToPeers()
        console.log(`WS : Listening on port ${P2P_PORT}`)
    }
    connectToPeers() {
        peers.forEach(peer => {
            const socket = new webSocket(peer)
                //Waits till the connection is established
            socket.on('open', () => {
                //connects to the socket
                this.connectSocket(socket)
            })
        })
    }
    connectSocket(socket) {
        //adds sockets to the socket array
        this.sockets.push(socket)
        console.log('Socket connected')
        this.messageHandler(socket)
        this.sendChain(socket)

    }
    messageHandler(socket) {
        //replaces the blockchain with the longest one when socket.send() is called
        socket.on('message', message => {
            const data = JSON.parse(message)
            if (data.type === MESSAGE_TYPE.chain) {
                this.blockchain.replaceChain(data)
            } else if (data.type === MESSAGE_TYPE.transaction) {
                this.transactionPool.addTransaction(data.transaction)
            } else {
                this.transactionPool.clear()
            }
        })
    }

    //helper function for socket.send()
    sendChain(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPE.chain,
            chain: this.blockchain.chain
        }))
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPE.transaction,
            transaction: transaction
        }))

    }

    //Synchronzies the data between all chains
    syncChains() {
            this.sockets.forEach(socket => {
                this.sendChain(socket)
            })
        }
        //Synchronizes all the transactions among the peers
    broadcastTransaction(transaction) {
            this.sockets.forEach(socket => {
                this.sendTransaction(socket, transaction)
            })
        }
        //clears all the transactions among the peers
    broadcastClear() {
        this.sockets.forEach(socket => {
            socket.send(JSON.stringify({
                type: MESSAGE_TYPE.clear
            }))
        })
    }
}
module.exports = P2pServer