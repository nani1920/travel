/** @format */

const bodyValidator = require("express-validator").body;
const queryValidator = require("express-validator").query;
const paramValidator = require("express-validator").param;
const { default: axios } = require("axios");
const url = require("url");

const BaseRequest = require("../_base.request");

const { query } = require("express-validator");

class ProductRequest extends BaseRequest {
  constructor() {
    super();
  }

  //Modified Here

  validateBadgeRequest() {
    return [
      queryValidator("badgeType")
        .notEmpty()
        .custom((value) => {
          const validBadges = ["NEW", "Top Choice"];
          if (typeof value === "string") {
            return validBadges.includes(value);
          }
          if (Array.isArray(value)) {
            return value.every((badge) => validBadges.includes(badge));
          }
        })
        .withMessage(
          "Invalid query parameters, badgeType must be one of 'NEW' or 'Top Choice'"
        ),
      this.validate,
    ];
  }

  validateSubcategoryRequest() {
    return [
      queryValidator("sub-category")
        .notEmpty()
        // .custom(value)
        .withMessage("Invalid sub-category query parameters"),
      this.validate,
    ];
  }

  // end of Modification
}

module.exports = new ProductRequest();
