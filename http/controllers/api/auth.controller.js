/**
 * Third Party Libraries
 *
 * @format
 */

require("dotenv");
const env = process.env;
const _ = require("lodash");
const db = require("mongoose");
const moment = require("moment");
const bcrypt = require("bcrypt");
/* Third Party Libraries */

/* Local Files */
const BaseController = require("../_base.controller");
const Helper = require("../../../helpers/helpers");
/* Local Files */

/* Responses */
const AuthResponse = require("../../responses/api/auth.response");
const BadRequestError = require("../../../exceptions/badRequest.exception");
/* End Responses */

class AuthController extends BaseController {
  constructor() {
    super();
  }

  register = async (req, res) => {
    const response = new AuthResponse(req, res);
    const session = req.dbSession;
    this._userRepository.setDBSession(session);
    try {
      let body = _.pick(req.body, [
        "fullName",
        "email",
        "password",
        "phone",
        "avatar",
      ]);
      body.password = Helper.hashString(body.password);
      let isUserExist = await this._userRepository.findOne({
        email: body.email,
      });
      if (isUserExist) {
        throw new BadRequestError("User already exists");
      }
      let user = await this._userRepository.createOrUpdateById(null, body);
      user = _.omit(user.toObject(), ["password", "tokens"]);
      return response.postDataResponse(user);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  login = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { email, password } = req.body;
      const user = await this._userRepository.findOne({ email });
      console.log(user);
      if (!user) {
        throw new BadRequestError("Invalid Credentials");
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new BadRequestError("Invalid Credentials");
      }
      return response.postDataResponse(user);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  sendEmailOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      // const { email, userId } = req.body;
      let { user, email } = req;

      const OTP = Helper.generateOTP(1000, 9999);
      const id = user._id;

      const data = {
        twoFaCode: OTP.toString(),
        // isEmailOtpVerified: false,
        email,
      };
      user = await this._userRepository.createOrUpdateById(id, data);
      // await Helper.sendEmailOTP(OTP, email);
      console.log(user);
      return response.sendEmailOtpResponse(OTP);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  verifyEmailOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { email, otp } = req.body;
      let { user } = req;

      if (user.twoFaCode !== otp.toString()) {
        throw new BadRequestError("OTP Doesn't Match");
      }
      user = await this._userRepository.createOrUpdateById(user._id, {
        isLoginOtpVerified: true,
      });
      const { token } = _.pick(user.tokens[0], "token");
      return response.verifyEmailOtpResponse(token);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  sendRegisterOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      let body = _.pick(req.body, ["fullName", "phone", "dob", "countryCode"]);
      let { user } = req;

      const OTP = Helper.generateOTP(1000, 9999);
      const data = {
        twoFaCode: OTP.toString(),
        // isLoginOtpVerified: false,
        ...body,
      };

      const userId = user ? user._id : null;
      user = await this._userRepository.createOrUpdateById(userId, data);
      // console.log(user);
      return response.sendRegisterOtpResponse(OTP);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  verifyRegisterOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { otp } = req.body;
      let { user } = req;

      console.log(user.twoFaCode !== otp.toString());
      if (user.twoFaCode !== otp.toString()) {
        throw new BadRequestError("OTP Doesn't Match");
      }
      // user = await this._userRepository.createOrUpdateById(user._id, {
      //   isLoginOtpVerified: true,
      // });
      user = _.pick(user.toObject(), ["_id"]);

      return response.verifyRegisterOtpResponse(user);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  uploadDocument = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { studentIdDocument, userId } = req.body;
      let { user } = req;

      user = await this._userRepository.createOrUpdateById(user._id, {
        userIdDocument: studentIdDocument,
        isLoginOtpVerified: true,
      });

      const userData = _.pick(user, ["tokens"]);
      return response.uploadDocumentResponse({
        message: "Document Uploaded Successfully",
        userData,
      });
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  sendLoginOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      let { user } = req;

      const OTP = Helper.generateOTP(1000, 9999);
      const id = user._id;
      const data = {
        twoFaCode: OTP.toString(),
        // isLoginOtpVerified: false,
      };
      user = await this._userRepository.createOrUpdateById(id, data);
      console.log(user);
      return response.sendLoginOtpResponse(OTP);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  verifyLoginOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { phone, otp } = req.body;
      let { user } = req;

      if (user.twoFaCode !== otp.toString()) {
        throw new BadRequestError("OTP Doesn't Match");
      }
      // user = await this._userRepository.createOrUpdateById(user._id, {
      //   isLoginOtpVerified: true,
      // });
      user = _.pick(user.toObject(), ["tokens"]);
      return response.verifyLoginOtpResponse(user);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  sendLoginEmailOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { email } = req.body;
      let { user } = req;

      const OTP = Helper.generateOTP(1000, 9999);
      const id = user._id;
      const data = {
        twoFaCode: OTP.toString(),
        // isEmailOtpVerified: false,
      };
      user = await this._userRepository.createOrUpdateById(id, data);
      // await Helper.sendEmailOTP(OTP, email);
      // console.log(user);
      return response.sendLoginEmailOtpResponse({
        message: "OTP sent successfully",
        OTP,
      });
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };
}

module.exports = new AuthController();
