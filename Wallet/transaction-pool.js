const Transaction = require('./transaction.js')
class TransactionPool {
    constructor() {
        this.transactions = []
    }
    addTransaction(transaction) {
        let current_trn = this.transactions.find(t => t.id === transaction.id)
        if (current_trn) {
            //replaces the transaction if it already exists
            this.transactions[this.transactions.indexOf(current_trn)] = transaction
        } else {
            //adds it to the pool
            this.transactions.push(transaction)
        }
    }
    existingTransaction(address) {
        //checks for existence
        return this.transactions.find(t => t.input.address === address)
    }
    validTransactions() {
            return this.transactions.filter(transaction => {
                //Checks if total amount sent and received match or not
                const op_total = transaction.outputs.reduce((total, output) => {
                    return total + output.amount
                }, 0)
                if (op_total !== transaction.input.amount) {
                    console.log(`Invalid Transaction from the sender : ${transaction.input.address}`)
                    return;
                }
                //Signature verification
                if (!Transaction.verifyTransaction(transaction)) {
                    console.log(`Invalid Transaction from the sender : ${transaction.input.address}`)
                    return;

                }
                return transaction
            })
        }
        //clears all transactions from the pool after a new transaction is mined
    clear() {
        this.transactions = []
    }
}
module.exports = TransactionPool