const EC = require('elliptic').ec
const sha = require('crypto-js/sha256')
const uid = require('uuid')
const ec = new EC('secp256k1')

class Util {
    //for transaction ids
    static id() {
            return uid.v1()
        }
        //creating public and private key
    static genKeyPair() {
            return ec.genKeyPair()
        }
        //hashing the data via SHA256
    static hash(hashData) {
            return sha(JSON.stringify(hashData)).toString()
        }
        //Verifying the signature based on public key
    static verifySignature(public_key, signature, hash) {
        return ec.keyFromPublic(public_key, 'hex').verify(hash, signature)
    }
}
module.exports = Util