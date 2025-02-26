/** @format */

const bodyValidator = require("express-validator").body;
const queryValidator = require("express-validator").query;
const paramValidator = require("express-validator").param;
const { default: axios } = require("axios");
const url = require("url");
const mongoose = require("mongoose");
const BaseRequest = require("../_base.request");

const { query } = require("express-validator");

class UserRequest extends BaseRequest {
  constructor() {
    super();
  }

  //Modified Here

  // validateDocument() {
  //   return [
  //     bodyValidator("studentIdDocument")
  //       .notEmpty()
  //       .withMessage("studentIdDocument is Required"),
  //     this.validate,
  //   ];
  // }

  updateProfileRequest() {
    return [
      //use optional method
      bodyValidator("fullName").optional(),
      bodyValidator("dob").optional(),
      bodyValidator("avatar").optional(),
      bodyValidator("language").optional(),
      this.validate,
    ];
  }

  postReviewRequest() {
    return [
      bodyValidator("rating").isInt().withMessage("rating is Required"),
      bodyValidator("review").notEmpty().withMessage("review is Required"),
      bodyValidator("vendorId")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("vendorId is Required");
          }
          const isVendorExist = await this._vendorRepository.findById(
            mongoose.Types.ObjectId(value)
          );
          if (!isVendorExist) {
            throw new Error("Vendor is invalid");
          }
        }),
      this.validate,
    ];
  }
  // end of Modification
}

module.exports = new UserRequest();
