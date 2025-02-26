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

class UserController extends BaseController {
  constructor() {
    super();
  }

  updateProfile = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      let { user } = req;
      let body = _.pick(req.body, ["fullName", "dob", "avatar", "language"]);

      const updatedBody = {};
      Object.keys(body).forEach((key) => {
        if (body[key] !== undefined && body[key] !== "") {
          updatedBody[key] = body[key];
        }
      });

      let updatedProfile = await this._userRepository.createOrUpdateById(
        user._id,
        updatedBody,
        "fullname phone dob countryCode avatar email language"
      );

      response.updateProfileResponse(updatedProfile);
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

      return response.getVendorsResponse(vendors);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  getVendor = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const { vendorId } = req.params;
      let { page, pageSize } = req.query;

      if (pageSize > 100) {
        pageSize = 100;
      }

      const select = {
        category: 0,
        subCategory: 0,
        isTopBrand: 0,
        isTrending: 0,
      };

      const vendorDetailsQuery = await this._vendorRepository.findById(
        vendorId,
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
        ...vendorDetailsQuery._doc,
        promos: {
          ...promos,
        },
      };
      return response.getVendorResponse(resultData);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };

  getReviews = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const { vendorId } = req.params;
      const { page, pageSize } = req.query;
      const paginator = {
        page,
        pageSize,
        filters: {
          match: {
            vendorId: mongoose.Types.ObjectId(vendorId),
          },
        },
        lookup: [
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
        ],
        project: {
          rating: 1,
          review: 1,
          vendorId: 1,
          createdAt: 1,
          updatedAt: 1,
          "userDetails.fullName": 1,
        },
      };
      const reviews = await this._RatingRepository.getAll(paginator);
      return response.getReviewsResponse(reviews);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      response.internalServerErrorResponse(e);
    }
  };

  postReview = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const { user } = req;
      let body = _.pick(req.body, ["rating", "review", "vendorId"]);
      body.userId = user._id;
      const review = await this._RatingRepository.createOrUpdateById(
        null,
        body
      );
      response.postReviewResponse(review);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      response.internalServerErrorResponse(e);
    }
  };
}

module.exports = new UserController();
