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

  postRegisterOtpRequest() {
    return [
      bodyValidator("fullName").notEmpty().withMessage("Fullname is Required"),
      bodyValidator("phone")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("phone is Required");
          }
          let user = await this._userRepository.findOne({
            phone: value,
          });

          if (user && user.isLoginOtpVerified) {
            throw new Error("User already Exist,Please Login");
          }
          req.user = user;
        }),
      bodyValidator("countryCode")
        .notEmpty()
        .withMessage("countryCode is Required"),
      bodyValidator("dob").notEmpty().withMessage("DOB is Required"),
      this.validate,
    ];
  }

  postVerifyRegisterOtpRequest() {
    return [
      bodyValidator("phone")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("phone is Required");
          }
          let user = await this._userRepository.findOne({
            phone: value,
          });
          if (!user) {
            throw new Error("Phone Doesn't Exist");
          }
          req.user = user;
        }),
      bodyValidator("otp").notEmpty().withMessage("OTP is Required"),
      this.validate,
    ];
  }

  postEmailOtpRequest() {
    return [
      bodyValidator("userId")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("userId is Required");
          }
          let isUserExist = await this._userRepository.findById(value);
          if (!isUserExist) {
            throw new Error("UserId Doesn't Exist");
          }
          req.user = isUserExist;
        }),
      bodyValidator("email")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("email is Required");
          }
          const { user } = req;
          let isEmailExist = await this._userRepository.find({ email: value });
          if (
            isEmailExist.length >= 1 &&
            !isEmailExist[0]._id.equals(user._id)
          ) {
            throw new Error("Email is already Taken");
          }
          req.email = value;
        }),
      this.validate,
    ];
  }

  postVerifyEmailOtpRequest() {
    return [
      bodyValidator("email")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("email is Required");
          }
          let user = await this._userRepository.findOne({
            email: value,
          });
          if (!user) {
            throw new Error("Email Doesn't Exist");
          }
          req.user = user;
        }),
      bodyValidator("otp").notEmpty().withMessage("OTP is Required"),
      this.validate,
    ];
  }

  validateDocumentRequest() {
    return [
      bodyValidator("studentIdDocument")
        .notEmpty()
        .withMessage("studentIdDocument is Required"),
      bodyValidator("userId")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("userId is Required");
          }
          let isUserExist = await this._userRepository.findById(value);
          if (!isUserExist) {
            throw new Error("UserId Doesn't Exist");
          }
          req.user = isUserExist;
        }),
      this.validate,
    ];
  }

  postLoginOtpRequest() {
    return [
      bodyValidator("phone")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("phone is Required");
          }
          let isUserExist = await this._userRepository.findOne({
            phone: value,
          });
          if (!isUserExist) {
            throw new Error("User Doesn't Exist,Please Register");
          }
          if (!isUserExist.isLoginOtpVerified) {
            throw new Error("User Doesn't Exist,Please Register");
          }
          req.user = isUserExist;
        }),
      this.validate,
    ];
  }

  postVerifyLoginOtpRequest() {
    return [
      bodyValidator("phone")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("phone is Required");
          }
          let user = await this._userRepository.findOne({
            phone: value,
          });
          if (!user) {
            throw new Error("Phone Doesn't Exist");
          }
          req.user = user;
        }),
      bodyValidator("otp").notEmpty().withMessage("OTP is Required"),
      this.validate,
    ];
  }

  postLoginEmailOtpRequest() {
    return [
      bodyValidator("email")
        .notEmpty()
        .custom(async (value, { req }) => {
          if (value.trim() === "" || value === null) {
            throw new Error("email is Required");
          }
          const isEmailExist = await this._userRepository.findOne({
            email: value,
          });
          if (!isEmailExist) {
            throw new Error("Email Doesn't Exist, Please Register");
          }

          if (!isEmailExist.isLoginOtpVerified) {
            throw new Error("Email Doesn't Exist, Please Register");
          }
          req.user = isEmailExist;
        }),
      this.validate,
    ];
  }

  // end of Modification
}

module.exports = new AuthRequest();
