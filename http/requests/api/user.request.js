/** @format */

const bodyValidator = require("express-validator").body;
const queryValidator = require("express-validator").query;
const paramValidator = require("express-validator").param;
const { default: axios } = require("axios");
const url = require("url");
const mongoose = require("mongoose");
const BaseRequest = require("../_base.request");
const ModelHelper = require("../../../helpers/model.helper");

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
      bodyValidator("rating")
        .exists()
        .bail()
        .withMessage("rating is required")
        .isInt()
        .withMessage("rating should be a Number"),
      bodyValidator("review").notEmpty().withMessage("review is Required"),
      bodyValidator("vendorId")
        .exists()
        .bail()
        .withMessage("vendorId is Required")
        .isMongoId()
        .bail()
        .withMessage("vendorId is not valid")
        .custom(ModelHelper.checkIdInModel({ model: "Vendor" })),
      this.validate,
    ];
  }

  postRedeemOfferRequest() {
    return [
      bodyValidator("vendorId")
        .exists()
        .bail()
        .withMessage("vendorId is Required")
        .isMongoId()
        .bail()
        .withMessage("vendorId is not valid")
        .custom(ModelHelper.checkIdInModel({ model: "Vendor" })),
      bodyValidator("promoId")
        .exists()
        .bail()
        .withMessage("promoId is Required")
        .isMongoId()
        .bail()
        .withMessage("promoId is not valid")
        .custom(ModelHelper.checkIdInModel({ model: "Promo" })),
      bodyValidator("pin")
        .exists()
        .bail()
        .withMessage("pin is Required")
        .custom(async (value, { req }) => {
          if (
            (typeof value === "string" && value.trim() === "") ||
            value === null
          ) {
            throw new Error("pin shouldn't be empty");
          }
          let { Vendor } = req;
          if (Vendor && parseInt(value) !== parseInt(Vendor.pin)) {
            throw new Error("entered wrong pin");
          }
        }),
      bodyValidator("estimatedSavings")
        .exists()
        .withMessage("estimatedSavings is Required"),
      bodyValidator("totalBill").exists().withMessage("totalBill is Required"),
      this.validate,
    ];
  }

  getNearVendorsRequest() {
    return [
      queryValidator("latitude")
        .exists()
        .bail()
        .withMessage("Latitude is Required")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be between -90 and 90"),
      queryValidator("longitude")
        .exists()
        .bail()
        .withMessage("longitude is Required")
        .isFloat({ min: -180, max: 180 })
        .withMessage("latitude must be between -180 and 180"),
      this.validate,
    ];
  }
  // end of Modification
}

module.exports = new UserRequest();
