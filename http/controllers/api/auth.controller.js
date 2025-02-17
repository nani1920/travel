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
      const { email, userId } = req.body;
      let isUserExist = await this._userRepository.findById(userId);
      if (!isUserExist) {
        throw new BadRequestError("UserId Doesn't Exist");
      }
      let isEmailExist = await this._userRepository.find({ email });
      // console.log(isEmailExist);
      // console.log(isEmailExist.length);
      // console.log(isEmailExist[0]._id);
      // console.log(isUserExist._id);
      // console.log(isEmailExist[0]._id !== isUserExist._id);
      if (
        isEmailExist.length >= 1 &&
        !isEmailExist[0]._id.equals(isUserExist._id)
      ) {
        throw new BadRequestError("Email is already Taken");
      }
      const OTP = Helper.generateOTP(1000, 9999);
      const id = isUserExist._id;
      console.log(id);
      const data = {
        twoFaCode: OTP.toString(),
        // isEmailOtpVerified: false,
        email,
      };
      const user = await this._userRepository.createOrUpdateById(id, data);
      // await Helper.sendEmailOTP(OTP, email);
      console.log(user);
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
        isLoginOtpVerified: true,
      });
      // console.log(user);
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

  sendRegisterOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      let body = _.pick(req.body, ["fullName", "phone", "dob", "countryCode"]);
      let isUserExist = await this._userRepository.findOne({
        phone: body.phone,
      });
      // is phone otp verified
      // console.log(body);
      // let parts = body.dob.split("-");
      // body.dob = new Date(parts[2], parts[1] - 1, parts[0]);
      // console.log(body.dob.toLocaleDateString());
      // console.log(isUserExist.isLoginOtpVerified);
      if (isUserExist && !isUserExist.isLoginOtpVerified) {
        throw new BadRequestError("User already Exist,Please Login");
      }
      const OTP = Helper.generateOTP(1000, 9999);
      const data = {
        twoFaCode: OTP.toString(),
        // isLoginOtpVerified: false,
        ...body,
      };

      const userId = isUserExist ? isUserExist._id : null;

      let user = await this._userRepository.createOrUpdateById(userId, data);
      console.log(user);
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

  verifyRegisterOtp = async (req, res) => {
    const response = new AuthResponse(req, res);
    try {
      const { phone, otp } = req.body;
      let user = await this._userRepository.findOne({
        phone: phone,
      });
      if (!user) {
        throw new BadRequestError("Phone Doesn't Exist");
      }
      console.log(user);
      console.log(user.twoFaCode);
      console.log(otp);
      console.log(user.twoFaCode !== otp.toString());
      if (user.twoFaCode !== otp.toString()) {
        throw new BadRequestError("OTP Doesn't Match");
      }
      // user = await this._userRepository.createOrUpdateById(user._id, {
      //   isLoginOtpVerified: true,
      // });
      user = _.pick(user.toObject(), ["_id"]);

      return response.verifyOtpResponse({
        message: "OTP verified Successfully",
        user,
      });
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

      let user = await this._userRepository.createOrUpdateById(userId, {
        userIdDocument: studentIdDocument,
        isLoginOtpVerified: true,
      });

      if (!user) {
        throw new BadRequestError("UserId Doesn't Exist");
      }

      const userData = _.pick(user, ["tokens"]);
      return response.sendDocumentUploadResponse({
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
      const { phone } = req.body;
      let isUserExist = await this._userRepository.findOne({
        phone: phone,
      });
      if (!isUserExist) {
        throw new BadRequestError("User Doesn't Exist,Please Register");
      }
      console.log(isUserExist.isLoginOtpVerified);
      // console.log(!isUserExist);
      // console.log(!isUserExist || isUserExist.isLoginOtpVerified);

      if (!isUserExist.isLoginOtpVerified) {
        throw new BadRequestError("User Doesn't Exist,Please Register");
      }

      const OTP = Helper.generateOTP(1000, 9999);
      const id = isUserExist._id;
      const data = {
        twoFaCode: OTP.toString(),
        // isLoginOtpVerified: false,
      };
      let user = await this._userRepository.createOrUpdateById(id, data);
      console.log(user);
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

  verifyLoginOtp = async (req, res) => {
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
      // user = await this._userRepository.createOrUpdateById(user._id, {
      //   isLoginOtpVerified: true,
      // });
      user = _.pick(user.toObject(), ["tokens"]);
      return response.verifyOtpResponse({
        message: "OTP verified Successfully",
        user,
      });
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

      const isEmailExist = await this._userRepository.findOne({ email });
      // console.log(isEmailExist);
      // console.log(isEmailExist.isLoginOtpVerified);
      // console.log(!isEmailExist || !isEmailExist.isLoginOtpVerified);
      if (!isEmailExist) {
        throw new BadRequestError("Email Doesn't Exist, Please Register");
      }

      if (!isEmailExist.isLoginOtpVerified) {
        throw new BadRequestError("Email Doesn't Exist, Please Register");
      }
      const OTP = Helper.generateOTP(1000, 9999);
      const id = isEmailExist._id;
      // console.log(id);
      const data = {
        twoFaCode: OTP.toString(),
        // isEmailOtpVerified: false,
      };
      const user = await this._userRepository.createOrUpdateById(id, data);
      // await Helper.sendEmailOTP(OTP, email);
      // console.log(user);
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
}

module.exports = new AuthController();
