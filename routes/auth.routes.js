/** @format */

const express = require("express");
const Route = express.Router();

/**
 *
 * Bad Request Error Response
 * @typedef {object} BadRequestResponse
 * @property {number} status -status code
 * @property {string} statusText - status code in text
 * @property {string} statusText - error message
 *
 */
/**
 * Internal Server Error Response
 * @typedef {object} internalServerErrorResponse
 * @property {string} url -url
 * @property {number} status - status code
 * @property {string} statusText - error message
 */

/* Local files*/
const upload = require("../config/fileUpload");
/*End Local files*/

/* Middleware*/
const ApiMiddleware = require("../http/middlewares/api");
/* End Middleware*/

/* Requests*/
const UserAuthRequest = require("../http/requests/api/auth.request");
/* End Requests*/

/* Controllers*/
const UserAuthController = require("../http/controllers/api/auth.controller");
/* End Controllers*/

/* Routes*/

/**Auth Routes */
Route.post(
  "/user/register",
  UserAuthRequest.postRegister(),
  UserAuthController.register
);
Route.post(
  "/user/login",
  UserAuthRequest.postLogin(),
  UserAuthController.login
);
/* End Auth Routes*/

/** OTP Routes */

/** Register otp routes */
Route.post(
  "/user/register/send-otp",
  UserAuthRequest.postRegisterOtpRequest(),
  UserAuthController.sendRegisterOtp
);

Route.post(
  "/user/register/verify-otp",
  UserAuthRequest.postVerifyRegisterOtpRequest(),
  UserAuthController.verifyRegisterOtp
);
/** END Register otp routes */

/** email otp routes */
Route.post(
  "/user/email/send-otp",
  UserAuthRequest.postEmailOtpRequest(),
  UserAuthController.sendEmailOtp
);
Route.post(
  "/user/email/verify-otp",
  UserAuthRequest.postVerifyEmailOtpRequest(),
  UserAuthController.verifyEmailOtp
);
/** END email otp routes */

/** Document upload Route */
Route.post(
  "/update/user",
  UserAuthRequest.validateDocumentRequest(),
  UserAuthController.uploadDocument
);
/** End Document upload Route */

/** Login otp routes */
Route.post(
  "/user/login/send-otp",
  UserAuthRequest.postLoginOtpRequest(),
  UserAuthController.sendLoginOtp
);

Route.post(
  "/user/login/verify-otp",
  UserAuthRequest.postVerifyLoginOtpRequest(),
  UserAuthController.verifyLoginOtp
);
/** END Login otp routes */

Route.post(
  "/user/login/email/send-otp",
  UserAuthRequest.postLoginEmailOtpRequest(),
  UserAuthController.sendLoginEmailOtp
);

Route.post(
  "/user/login/email/verify-otp",
  UserAuthRequest.postVerifyEmailOtpRequest(),
  UserAuthController.verifyEmailOtp
);

/** End OTP Routes */

module.exports = Route;
