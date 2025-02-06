/** @format */

const bodyValidator = require("express-validator").body;
const queryValidator = require("express-validator").query;
const paramValidator = require("express-validator").param;
const { default: axios } = require("axios");
const url = require("url");

const BaseRequest = require("../_base.request");

const { query } = require("express-validator");

class AuthRequest extends BaseRequest {
  constructor() {
    super();
  }

  postRegister() {
    return [
      bodyValidator("fullName").notEmpty().withMessage("Full Name is required"),
      bodyValidator("email").notEmpty().withMessage("Email is required"),
      bodyValidator("password").notEmpty().withMessage("Password is required"),
      bodyValidator("phone")
        .optional()
        .isMobilePhone()
        .withMessage("Phone is invalid"),
      this.validate,
    ];
  }

  postLogin() {
    return [
      bodyValidator("email").notEmpty().withMessage("Email is required"),
      bodyValidator("password").notEmpty().withMessage("Password is required"),
      this.validate,
    ];
  }

  //Modified Here

  postEmailOtp() {
    return [
      bodyValidator("email").notEmpty().withMessage("Email is Required"),
      this.validate,
    ];
  }

  postVerifyEmailOtp() {
    return [
      bodyValidator("email").notEmpty().withMessage("Email is Required"),
      bodyValidator("otp").notEmpty().withMessage("OTP is Required"),
      this.validate,
    ];
  }

  postMobileOtp() {
    return [
      bodyValidator("phone").notEmpty().withMessage("Phone is Required"),
      this.validate,
    ];
  }

  postVerifyMobileOtp() {
    return [
      bodyValidator("phone").notEmpty().withMessage("Phone is Required"),
      bodyValidator("otp").notEmpty().withMessage("OTP is Required"),
      this.validate,
    ];
  }
  // end of Modification
}

module.exports = new AuthRequest();
