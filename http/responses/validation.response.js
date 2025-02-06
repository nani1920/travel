const BaseResponse = require('./_base.response');
module.exports = class ValidationResponse extends BaseResponse {

    constructor(req, res) {
        super(req, res)
    }

    validationError(data) {
        return this.badRequestResponse(data);
    }

    middlewareError(data) {
        return this.unauthorizedResponse(data)
    }
}