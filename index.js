//Imports
const exp = require('express')
const bodyParser = require('body-parser')
const BlockChain = require('./BlockChain/blockchain.js')
const P2pServer = require('./BlockChain/p2p-server.js')
const Wallet = require('./Wallet/wallet.js')
const TransactionPool = require('./Wallet/transaction-pool.js')
const Miner = require('./Mining/miner.js')

//Initialization
const app = exp()
const HTTP_PORT = process.env.HTTP_PORT || 3000
const block_chain = new BlockChain()
const wallet = new Wallet()
const trn_pool = new TransactionPool()
const p2p_server = new P2pServer(block_chain, trn_pool)
const miner = new Miner(block_chain, trn_pool, p2p_server, wallet)

//Middleware
app.use(bodyParser.json())

//GET requests
app.get('/blocks', (req, res) => {
    res.json(block_chain.chain)
})

app.get('/transactions', (req, res) => {
    res.json(trn_pool.transactions)
})

app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.public_key })
})
app.get('/mine-transactions', (req, res) => {
    const block = miner.mine()
    console.log(`New Block added ${block.toString()}`)
    res.redirect('/blocks')
})

//POST requests
app.post('/mine', (req, res) => {
    block_chain.addBlock(req.body.data)
    console.log('New Block added')
    p2p_server.syncChains()
    res.redirect('/blocks')
})
app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body
    const transaction = wallet.createTransaction(recipient, amount, block_chain, trn_pool)
    p2p_server.broadcastTransaction(transaction)
    res.redirect('/transactions')
})

//Listener
app.listen(HTTP_PORT, () => {
    console.log(`HTTP : Listening on port ${HTTP_PORT}`)
})
p2p_server.listen()