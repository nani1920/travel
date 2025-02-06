/** @format */

const bodyValidator = require("express-validator").body;
const queryValidator = require("express-validator").query;
const paramValidator = require("express-validator").param;
const { default: axios } = require("axios");
const url = require("url");

const BaseRequest = require("../_base.request");

const { query } = require("express-validator");

class UserRequest extends BaseRequest {
  constructor() {
    super();
  }

  //Modified Here

  validateDocument() {
    return [
      bodyValidator("studentIdDocument")
        .notEmpty()
        .withMessage("studentIdDocument is Required"),
      this.validate,
    ];
  }

  // end of Modification
}

module.exports = new UserRequest();
