/** @format */

const BaseResponse = require("../_base.response");

module.exports = class AuthResponse extends BaseResponse {
  constructor(req, res) {
    super(req, res);
  }

  postDataResponse(data) {
    return this.okResponse(data);
  }

  uploadDocumentResponse(data) {
    return this.okResponse(data);
  }

  sendEmailOtpResponse(data) {
    return this.okResponse(data);
  }

  verifyEmailOtpResponse(data) {
    return this.okResponse(data);
  }

  sendRegisterOtpResponse(data) {
    return this.okResponse(data);
  }

  verifyRegisterOtpResponse(data) {
    return this.okResponse(data);
  }

  sendLoginOtpResponse(data) {
    return this.okResponse(data);
  }

  verifyLoginOtpResponse(data) {
    return this.okResponse(data);
  }

  sendLoginEmailOtpResponse(data) {
    return this.okResponse(data);
  }
};
