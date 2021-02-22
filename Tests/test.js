const Wallet = require('../Wallet/wallet.js')
const Transaction = require('../Wallet/transaction.js')
describe('Transaction', () => {
    let transaction, wallet, recipient, amount
    beforeEach(() => {
        wallet = new Wallet()
        amount = 50
        recipient = 'jalk34f'
        transaction = Transaction.newTransaction(wallet, recipient, amount)
    })
    it('tst 1', () => {
        expect(transaction.outputs.find(output => output.address === wallet.public_key).amount).toEqual(wallet.balance - amount)
    })
})