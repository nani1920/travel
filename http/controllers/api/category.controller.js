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
const mongoose = require("mongoose");
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
const SubCategoryModel = require("../../../models/subCategory.model");

class CategoryController extends BaseController {
  constructor() {
    super();
  }

  getCategories = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const { categoryId } = req.params;
      const { pageNo, pageSize } = req.query;
      const filters = {};
      if (categoryId) {
        filters["match"] = { categoryId: mongoose.Types.ObjectId(categoryId) };
        const paginator = {
          page: pageNo,
          size: pageSize,
          filters,
        };
        const subCategories = await this._subCategoryRepository.getAll(
          paginator
        );
        return response.getCategoriesResponse(subCategories);
      }
      const paginator = {
        page: pageNo,
        size: pageSize,
        lookup: [
          {
            $lookup: {
              from: "subcategories",
              localField: "_id",
              foreignField: "categoryId",
              as: "SubCategories",
            },
          },
        ],
      };
      let categories = await this._categoryRepository.getAll(paginator);
      return response.getCategoriesResponse(categories);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };
}

module.exports = new CategoryController();
