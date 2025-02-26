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
const RatingModel = require("../../../models/rating.model");
const PromoModel = require("../../../models/promo.model");
const { response } = require("express");

class VendorController extends BaseController {
  constructor() {
    super();
  }
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

  getVendors = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const { isNew, isTrending, isTopBrand, subCategory } = req.query;
      const filteredQuery = {};
      if (isTrending === "true") {
        filteredQuery.isTrending = true;
      }
      if (isTopBrand === "true") {
        filteredQuery.isTopBrand = true;
      }
      let limit = null;
      if (isNew === "true") {
        limit = 4;
      }
      if (subCategory) {
        filteredQuery["subCategory.name"] = subCategory;
      }

      const vendors = await this._vendorRepository.find(
        filteredQuery,
        null,
        null,
        { createdAt: -1 },
        limit
      );

      // const paginator = {
      //   filter: [
      //     {
      //       match: filteredQuery,
      //     },
      //     {
      //       getElement: "id",
      //     },
      //   ],
      // };

      // const vendorList = await this._vendorRepository.getAll();
      return response.sendCategoriesResponse(vendors);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  // getVendors = async (req, res) => {
  //   const response = new UserResponse(req, res);
  //   try {
  //     const { isNew, isTrending, isTopBrand, subCategory } = req.query;
  //     const filteredQuery = {};
  //     if (isNew === "true" || isTrending === "true") {
  //       filteredQuery["badges.badgeType"] = { $in: [] };
  //       if (isNew === "true") filteredQuery["badges.badgeType"].$in.push("NEW");
  //       if (isTrending === "true")
  //         filteredQuery["badges.badgeType"].$in.push("Trending");
  //     }
  //     if (isTopBrand === "true") {
  //       filteredQuery.isTopBrand = true;
  //     }
  //     if (subCategory) {
  //       filteredQuery.subCategory = subCategory;
  //     }
  //     console.log(filteredQuery);

  //     const vendors = await this._vendorRepository.find(filteredQuery);
  //     return response.sendCategoriesResponse(vendors);
  //   } catch (e) {
  //     if (e instanceof BadRequestError) {
  //       return response.badRequestResponse(e);
  //     }
  //     return response.internalServerErrorResponse(e);
  //   }
  // };

  getVendor = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const { vendorId } = req.params;
      const { page, pageSize } = req.query;

      const select = {
        category: 0,
        subCategory: 0,
        isTopBrand: 0,
        isTrending: 0,
      };

      const vendorDetailsQuery = await this._vendorRepository.find(
        { _id: vendorId },
        select
      );
      const paginator = {
        page,
        pageSize,
        filters: {
          match: {
            vendorId: mongoose.Types.ObjectId(vendorId),
          },
        },
      };
      const promos = await this._promoRepository.getAll(paginator);

      const resultData = {
        ...vendorDetailsQuery[0]._doc,
        promos: {
          ...promos,
        },
      };
      return response.sendVendorDetailsResponse(resultData);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
    }
  };
}

module.exports = new VendorController();
