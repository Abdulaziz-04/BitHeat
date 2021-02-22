const Transaction = require("../Wallet/transaction.js")
const Wallet = require('../Wallet/wallet.js')

class Miner {
    //Basic attributes
    constructor(blockchain, trn_pool, p2p_server, wallet) {
        this.blockchain = blockchain,
            this.transactionPool = trn_pool,
            this.p2p_server = p2p_server,
            this.wallet = wallet
    }
    mine() {
        //Getting all the valid transactions
        const valid_transactions = this.transactionPool.validTransactions()
            //Pushing the reward transaction to the list
        valid_transactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockChainWallet()))
            //Adding the block of valid transaction
        const block = this.blockchain.addBlock(valid_transactions)
            //Synchronizing data
        this.p2p_server.syncChains()
            //Clearing and synchronizing the data 
        this.transactionPool.clear()
        this.p2p_server.broadcastClear()
        return block

    }
}
module.exports = Miner