const { DIFFICULTY, MINE_RATE } = require('../config/config')
const util = require('../Utilities/util.js')

//Block Class
class Block {
    //Basic attributes
    constructor(timestamp, last_hash, hash, data, nonce, difficulty) {
            this.timestamp = timestamp
            this.last_hash = last_hash
            this.hash = hash
            this.data = data
                //Random number for hashing problems
            this.nonce = nonce
                //Setitng up difficulty to adjust mining time
            this.difficulty = difficulty | DIFFICULTY
        }
        //To retreive information..
    toString() {
            return `Block has the following properties
        Timestamp : ${this.timestamp} 
        LastHash : ${this.last_hash}
        Hash : ${this.hash}
        Data : ${this.data}
        Nonce : ${this.nonce}
        Difficulty : ${this.difficulty}
        `
        }
        //The first Block of the blockchain
    static genesis() {
        return new this('Genesis Time', '-------------', 'zfkjw7ffd85', [], 0, DIFFICULTY)
    }

    //Building new blocks with hashes of previous block
    static mineBlock(last_block, data) {
            let timestamp, hash
            let { difficulty } = last_block
            let nonce = 0
            const last_hash = last_block.hash
                //Rehashing until the nonce condition of repeating zeros upto the DIFFICULTY variable is met.
            do {
                nonce++
                hash = Block.hash(timestamp, last_hash, data, nonce, difficulty)
                    //setting up the difficulty based on previous block's difficulty and timestamp
                difficulty = Block.adjustDifficulty(last_block, timestamp)
            }
            while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))
            return new Block(timestamp, last_hash, hash, data, nonce, difficulty)
        }
        //performing the hash 
    static hash(timestamp, last_hash, data, nonce, difficulty) {
        return util.hash(`${timestamp}${last_hash}${data}${nonce}${difficulty}`).toString()
    }

    //if data is manipulated in the chain,we use this as a verification funciton against hash
    static blockHash(block) {
        const { timestamp, last_hash, data, nonce, difficulty } = block
        return Block.hash(`${timestamp}${last_hash}${data}${nonce}${difficulty}`).toString()
    }
    static adjustDifficulty(last_block, current_time) {
        let { difficulty } = last_block
        //Setting up the difficulty...
        difficulty = last_block.timestamp + MINE_RATE > current_time ? difficulty + 1 : difficulty - 1
        return difficulty
    }
}
//Exporting the modules
module.exports = Block