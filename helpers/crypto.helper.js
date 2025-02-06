/* Third Party Libraries */
const crypto = require('crypto');
/* Third Party Libraries */

/* Local Files */
/* Local Files */

/* Controllers */
/* End Controllers */

class CryptoHelper {

    constructor() {
        this.algorithm = "aes-256-ctr";
        this.ENCRYPTION_KEY = Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
        this.IV_LENGTH = 16;
    }

    encrypt(text) {
        const iv = crypto.randomBytes(this.IV_LENGTH);
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.ENCRYPTION_KEY, 'hex'), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    decrypt(text) {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.ENCRYPTION_KEY, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    encryptWithSHA512(payload, secret) {
        const hash = crypto.createHash('sha512');
        hash.update(payload + secret);
        return hash.digest('hex');
    }

}

module.exports = new CryptoHelper();
