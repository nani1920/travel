/**
 * Third Party Libraries
 *
 * @format
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

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
const ProductRequest = require("../../requests/api/product.request");
/* End Requests*/

/* Responses */
const UserResponse = require("../../responses/api/user.response");
const BadRequestError = require("../../../exceptions/badRequest.exception");
/* End Responses */

const ProductModel = require("../../../models/product.model");
const VendorModel = require("../../../models/vendor.model");

class ProductController extends BaseController {
  constructor() {
    super();
  }

  getProducts = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const { badgeType } = req.query;
      console.log(badgeType);
      const filteredQuery = {};
      if (Array.isArray(badgeType)) {
        filteredQuery["badges.badgeType"] = { $in: badgeType };
      } else {
        filteredQuery["badges.badgeType"] = badgeType;
      }

      const select = [
        "bannerImg",
        "subCategory",
        "discountPercentage",
        "vendorId",
        "badges",
      ];
      const populate = { path: "vendorId", select: "name brandLogo" };
      const products = await this._productRepository.find(
        filteredQuery,
        select,
        populate
      );
      if (products.length === 0) {
        throw new BadRequestError("No Products Found");
      }
      return response.sendCategoriesResponse(products);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  getTopBrands = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const brands = await this._vendorRepository.find(
        { isTopBrand: true },
        "brandLogo"
      );
      if (brands.length === 0) {
        throw new BadRequestError("No Top-Brands Found");
      }
      return response.okResponse(brands);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  getSubcategories = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const { subCategory } = req.query;
      const filteredQuery = {};
      if (subCategory) {
        filteredQuery.subCategory = subCategory;
      }
      const select = [
        "bannerImg",
        "subCategory",
        "discountPercentage",
        "vendorId",
        "badges",
      ];
      const populate = { path: "vendorId", select: "name brandLogo" };
      const filteredProducts = await this._productRepository.find(
        filteredQuery,
        select,
        populate
      );
      if (filteredProducts.length === 0) {
        throw new BadRequestError("No Products found");
      }
      return response.okResponse(filteredProducts);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };
}

module.exports = new ProductController();
