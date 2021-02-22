const { REWARD } = require('../config/config.js')
const util = require('../Utilities/util.js')
class Transaction {
    constructor() {
        this.id = util.id()
        this.input = null
        this.outputs = []
    }
    update(sender, recipient, amount) {
            //Updating the data if the public key matches to the previous user
            let previous_sender = this.outputs.find(output => output.address === sender.public_key)
                //checking for edge case
            if (amount > sender.balance) {
                print(`${amount} exceeds current balance.`)
                return
            }
            //Updating the data 
            previous_sender.amount = previous_sender.amount - amount
            this.outputs.push({ amount: amount, address: recipient })
                //performing a new signature for each transaction
            Transaction.signTransaction(this, sender)
            return this
        }
        //reward after mining from the blockchain wallet itself
    static rewardTransaction(miner, blockchain_wallet) {
        const transaction = new this()
        transaction.outputs.push(...[
            { amount: REWARD, address: miner.public_key }
        ])
        Transaction.signTransaction(transaction, blockchain_wallet)
        return transaction
    }
    static newTransaction(sender, recipient, amount) {
        const transaction = new this()
            //edge case
        if (amount > sender.balance) {
            print(`${amount} exceeds current balance.`)
            return
        }
        //sender and reciver transaction data
        transaction.outputs.push(...[
                { amount: sender.balance - amount, address: sender.public_key },
                { amount: amount, address: recipient }
            ])
            //signing the transaction
        Transaction.signTransaction(transaction, sender)
        return transaction
    }
    static signTransaction(transaction, sender) {
        transaction.input = {
            timestamp: Date.now(),
            amount: sender.balance,
            address: sender.public_key,
            //For each transaction we sign the output data of each transaction which is hashed to a string of length 32
            //(ouputs can be of any length so we hash them first)
            signature: sender.sign(util.hash(transaction.outputs))
        }
    }
    static verifyTransaction(transaction) {
        //Verifying the transaction
        return util.verifySignature(transaction.input.address, transaction.input.signature, util.hash(transaction.outputs))

    }
}
module.exports = Transaction