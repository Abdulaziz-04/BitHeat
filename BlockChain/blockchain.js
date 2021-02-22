const Block = require('./block.js')
    //Building the Chain
class BlockChain {
    //Creating the first block
    constructor() {
            this.chain = [Block.genesis()]
        }
        //Adding more blocks
    addBlock(data) {
            //using data of previous block for the new block
            const lastBlock = this.chain[this.chain.length - 1]
            const block = Block.mineBlock(lastBlock, data)
                //adding the block to the chain
            this.chain.push(block)
            return block
        }
        //Checking validity of chain
    isValidChain(chain) {
            //Checking the base block 
            if (JSON.stringify(Block.genesis()) !== JSON.stringify(chain[0])) {
                return false
            }
            //Comparing the blocks via their hashes
            //1. Comparison between last.hash and current.last_hash 
            //2. Comparision between 2 same hashes to avoid data manipulation 
            for (let i = 1; i < chain.length; i++) {
                let current = chain[i]
                let previous = chain[i - 1]
                if (current.last_hash !== previous.hash || current.hash !== Block.blockHash(current)) {
                    return false
                }
            }
            return true
        }
        //Replacing with longer valid chain
    replaceChain(chain) {
        //Length Comparision
        if (chain.length < this.chain.length) {
            console.log('Recieved chain is not longer than current chain')
            return
            //Checking chain validity
        } else if (!this.isValidChain(chain)) {
            console.log('Chain is not valid')
        }
        //Replacing chain
        else {
            console.log('chain replaced')
            this.chain = chain
        }
    }

}
module.exports = BlockChain