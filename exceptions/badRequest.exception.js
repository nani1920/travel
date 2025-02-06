module.exports = class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}