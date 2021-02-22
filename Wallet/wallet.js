const e = require('express')
const Transaction = require('./transaction.js')
const { INITIAL_BALANCE } = require('../config/config.js')
const util = require('../Utilities/util.js')
class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE
        this.key_pair = util.genKeyPair()
        this.public_key = this.key_pair.getPublic().encode('hex')
    }
    toString() {
        return `Wallet has the following properties 
        Balance : ${this.balance}
        Public Key : ${this.public_key.toString()}`
    }

    //Generating signature
    sign(dataHash) {
        return this.key_pair.sign(dataHash)
    }

    createTransaction(recipient, amount, blockchain, transaction_pool) {
        //calculates balance for each transaction occuring
        this.balance = this.calculateBalance(blockchain)
        if (amount > this.balance) {
            console.log(`Amount : ${amount} exceeds given balance : ${balance}`)
            return
        }
        //if transaction already exists ,update it or else add it
        let transaction = transaction_pool.existingTransaction(this.public_key)
        if (transaction) {
            transaction.update(this, recipient, amount)
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount)
            transaction_pool.addTransaction(transaction)

        }
        return transaction
    }
    calculateBalance(blockchain) {
            let balance = this.balance
            let transactions = []
                //collecting list of all transactions in a block
            blockchain.chain.forEach(block => {
                    block.data.forEach(transaction => {
                        transactions.push(transaction)
                    })
                })
                //matching requried transactions for given address
            input_txns = transactions.filter(transaction => {
                transaction.input.address === this.public_key
            })
            let start = 0
                //getting the most recent transaction
            if (input_txns.length > 0) {
                const recent_txns = input_txns.reduce((prev, cur) => {
                        prev.input.timestamp > cur.input.timestamp ? prev : cur
                    })
                    //setting balance and timestamp to most recent values
                balance = recent_txns.outputs.find(output => {
                    output.address === this.public_key
                }).amount
                start = recent_txns.input.timestamp
            }
            //for each transaction add values to balance(after the recent transaction has occured)
            transactions.forEach(transaction => {
                if (transaction.input.timestamp > start) {
                    transaction.outputs.find(output => {
                        if (output.address === this.public_key) {
                            balance += output.amount
                        }
                    })
                }
            })
            return balance
        }
        //Special wallet for rewarding mining transactions
    static blockChainWallet() {
        const blockChainWallet = new this()
        blockChainWallet.address = 'blockchain-wallet'
        return blockChainWallet
    }
}
module.exports = Wallet