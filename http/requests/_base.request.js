/** @format */

const ValidationResponse = require("../responses/validation.response");
const { validationResult } = require("express-validator");

module.exports = class BaseRequest {
  validate(req, res, next) {
    const messages = [];
    if (!validationResult(req).isEmpty()) {
      const errors = validationResult(req).array();
      for (const i of errors) {
        const message = `${i.msg}`;
        if (!messages.includes(message)) {
          messages.push(message);
        }
      }
      return new ValidationResponse(req, res).validationError(messages);
    }
    next();
  }
};
