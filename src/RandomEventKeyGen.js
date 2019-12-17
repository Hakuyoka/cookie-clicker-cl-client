const crypto = require('crypto')
const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const N=16

class RandomEventKeyGen {
    constructor(){
        this.code = "";
    }

    generate() {
        this.code = Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n)=>S[n%S.length]).join('');
    }
}

module.exports = new RandomEventKeyGen();