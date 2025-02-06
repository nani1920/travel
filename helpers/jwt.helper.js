/* Third Party Libraries */
require('dotenv').config();
const promise = require('bluebird');
const jwt = promise.promisifyAll(require("jsonwebtoken"))
/* Third Party Libraries */

/* Local Files */
/* Local Files */

/* Controllers */
/* End Controllers */


class JWTHelper {
    async signToken(data) {
        return jwt.signAsync(data, process.env.JWT_SECRET, { expiresIn: "5m" });
    }

    async verifyToken(token) {
        return jwt.verifyAsync(token, process.env.JWT_SECRET);
    }
}

module.exports = new JWTHelper();

