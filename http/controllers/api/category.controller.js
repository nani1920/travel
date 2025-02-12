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

/** Requests */
const UserRequest = require("../../requests/api/user.request");
/* End Requests*/

/* Responses */
const UserResponse = require("../../responses/api/user.response");
const BadRequestError = require("../../../exceptions/badRequest.exception");
/* End Responses */

const CategoryModel = require("../../../models/category.model");

class CategoryController extends BaseController {
  constructor() {
    super();
  }

  getCategories = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      let categories = await this._categoryRepository.find();
      if (categories.length === 0) {
        throw new BadRequestError("No Categories Found");
      }
      return response.sendCategoriesResponse(categories);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };
}

module.exports = new CategoryController();
