/** @format */

const BaseResponse = require("../_base.response");

module.exports = class UserResponse extends BaseResponse {
  constructor(req, res) {
    super(req, res);
  }

  sendDocumentUploadResponse(data) {
    return this.okResponse(data);
  }

  sendCategoriesResponse(data) {
    return this.okResponse(data);
  }
};
