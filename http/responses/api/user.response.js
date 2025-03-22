/** @format */

const BaseResponse = require("../_base.response");

module.exports = class UserResponse extends BaseResponse {
  constructor(req, res) {
    super(req, res);
  }

  uploadDocumentResponse(data) {
    return this.okResponse(data);
  }

  getCategoriesResponse(data) {
    return this.okResponse(data);
  }

  updateProfileResponse(data) {
    return this.okResponse(data);
  }

  getVendorsResponse(data) {
    return this.okResponse(data);
  }

  getVendorResponse(data) {
    return this.okResponse(data);
  }

  getReviewsResponse(data) {
    return this.okResponse(data);
  }

  postReviewResponse(data) {
    return this.okResponse(data);
  }

  postRedeemOfferResponse(data) {
    return this.okResponse(data);
  }

  getRedemptionsResponse(data) {
    return this.okResponse(data);
  }

  getNearVendorsResponse(data) {
    return this.okResponse(data);
  }
};
