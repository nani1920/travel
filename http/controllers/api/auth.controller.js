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
      const { email } = req.body;
      let isUserExist = await this._userRepository.findOne({
        email: email,
      });
      if (!isUserExist) {
        throw new BadRequestError("Email Doesn't Exist");
      }
      const OTP = Helper.generateOTP(1000, 9999);
      const id = isUserExist._id;
      console.log(id);
      const data = {
        twoFaCode: OTP.toString(),
        isEmailOtpVerified: false,
      };
      const user = await this._userRepository.createOrUpdateById(id, data);
      // await Helper.sendEmailOTP(OTP, email);
      return response.sendOtpResponse({
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

  verifyEmailOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { email, otp } = req.body;
      let user = await this._userRepository.findOne({
        email: email,
      });
      if (!user) {
        throw new BadRequestError("Email Doesn't Exist");
      }
      if (user.twoFaCode !== otp.toString()) {
        throw new BadRequestError("OTP Doesn't Match");
      }
      user = await this._userRepository.createOrUpdateById(user._id, {
        isEmailOtpVerified: true,
      });
      const { token } = _.pick(user.tokens[0], "token");
      return response.verifyOtpResponse({
        message: "OTP verified Successfully",
        token,
      });
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  sendMobileOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { phone } = req.body;
      let isUserExist = await this._userRepository.findOne({
        phone: phone,
      });
      if (!isUserExist) {
        throw new BadRequestError("Phone Doesn't Exist");
      }
      const OTP = Helper.generateOTP(1000, 9999);
      const id = isUserExist._id;
      const data = {
        twoFaCode: OTP.toString(),
        isLoginOtpVerified: false,
      };
      await this._userRepository.createOrUpdateById(id, data);

      return response.sendOtpResponse({
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

  verifyMobileOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { phone, otp } = req.body;
      let user = await this._userRepository.findOne({
        phone: phone,
      });
      if (!user) {
        throw new BadRequestError("Phone Doesn't Exist");
      }
      if (user.twoFaCode !== otp.toString()) {
        throw new BadRequestError("OTP Doesn't Match");
      }
      user = await this._userRepository.createOrUpdateById(user._id, {
        isLoginOtpVerified: true,
      });
      const { token } = _.pick(user.tokens[0], "token");
      return response.verifyOtpResponse({
        message: "OTP verified Successfully",
        token,
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
