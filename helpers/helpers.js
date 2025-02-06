/** @format */

const env = require("dotenv").config().parsed;
const logger = require("../config/logger");
const bcrypt = require("bcrypt");
const path = require("path");
const axios = require("axios");

const fs = require("fs");
const { promisify } = require("util");
const fsAccess = promisify(fs.access);
const fsUnlink = promisify(fs.unlink);
const QRCode = require("qrcode");
const { customAlphabet } = require("nanoid");

//Importing local files
const Service = require("./services/service.helper");

class Helpers {
  constructor() {
    this.generateOTP = this.generateOTP.bind(this);
    this.sendResetPasswordLink = this.sendResetPasswordLink.bind(this);
  }

  generateRandomString(str = "1234567890abcdef", len = 10) {
    const nanoid = customAlphabet(str, len);
    return nanoid();
  }

  getErrorMessage([req, res], error = null) {
    console.log(error, "Error in getErrorMessage");
    // logger.error(error)
    return res.status(422).json({
      status: "fail",
      response: error ? error.message : "something_went_wrong",
    });
  }

  getSuccessMessage([req, res], data = null, customObj = null) {
    let response = {
      status: "success",
      response: data ? data : "request_process_successfully",
    };
    if (customObj) {
      response = { ...response, ...customObj };
    }
    return res.status(200).json(response);
  }

  getValidationErrorMessage([req, res], data = null, customObj = null) {
    console.log(data);
    logger.error(data);
    let response = {
      status: "fail",
      response: data ? data : "invalid_parameters",
    };
    if (customObj) {
      response = { ...response, ...customObj };
    }
    return res.status(422).json(response);
  }

  generateOTP(min = 100000, max = 999999) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async sendEmailOTP(otp, receiverEmail) {
    console.log(otp);
    const content = `verify your otp:${otp}`;
    await Service.sendEmailNotification(receiverEmail, env.EMAIL_USER, content);
    return true;
  }

  sendOTP(otp) {
    return true;
  }

  sendResetPasswordLink() {
    const otp = this.generateOTP();
    //
    return otp;
  }

  getAuthErrorMessage([req, res], data = null) {
    return res.status(401).json({
      status: "fail",
      response: data,
    });
  }

  AdminUrl(value) {
    return env.ADMIN_URL + value;
  }

  AuthUrl(value) {
    return env.APP_URL + "/auth" + value;
  }

  hashString(string) {
    let saltRounds = 10;
    return bcrypt.hashSync(string, saltRounds);
  }

  compareHashedString(newString, originalString) {
    return bcrypt.compareSync(newString, originalString);
  }

  getFilename(files, name) {
    return files[name] ? files[name][0]["filename"] : null;
  }

  async removeFile(filename) {
    try {
      const filePath = this.getUploadPath(filename);
      await fsAccess(filePath, fs.constants.F_OK);
      await fsUnlink(filePath);
    } catch (e) {
      console.log(e);
    }
  }

  getUploadPath(filename) {
    return path.join(__dirname, "../", "public", "uploads/") + (filename || "");
  }

  async qrCodeGeneratorToBase64(data) {
    const opt = {
      margin: 1,
      scale: 10,
    };
    return QRCode.toDataURL(JSON.stringify(data), opt);
  }
}

module.exports = new Helpers();
