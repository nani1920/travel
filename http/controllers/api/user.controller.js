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
const promoModel = require("../../../models/promo.model");
const VendorModel = require("../../../models/vendor.model");
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
      let { isNew, isTrending, isTopBrand, subCategory, page, pageSize } =
        req.query;

      if (pageSize > 100) {
        pageSize = 100;
      }

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

      // const vendors = await this._vendorRepository.find(
      //   filteredQuery,
      //   null,
      //   null,
      //   { createdAt: -1 },
      //   limit
      // );

      const paginator = {
        pageSize: pageSize || limit,
        page: page,
        filters: {
          match: filteredQuery,
        },
      };

      const vendorlist = await this._vendorRepository.getAll(paginator);

      return response.getVendorsResponse(vendorlist);
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
      let { page, pageSize } = req.query;
      if (pageSize > 100) {
        pageSize = 100;
      }
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

  postRedeemOffer = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      let { estimatedSavings, totalBill } = req.body;
      const { Vendor, user, Promo } = req;
      const newTransaction = {
        userId: user._id,
        vendorId: Vendor._id,
        promoId: Promo._id,
        estimatedSavingPrice: estimatedSavings,
        totalBill,
      };

      await this._transactionHistoryRepository.createOrUpdateById(
        null,
        newTransaction
      );

      response.postRedeemOfferResponse("successfully redeemed offer");
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      response.internalServerErrorResponse(e);
    }
  };

  getRedemptions = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      let { user } = req;
      let { page, pageSize } = req.query; // add pageSize limit to 100
      if (pageSize > 100) {
        pageSize = 100;
      }
      const paginator = {
        page,
        pageSize,
        filters: {
          match: {
            userId: user._id,
          },
        },
        lookup: [
          {
            $lookup: {
              from: "vendors",
              localField: "vendorId",
              foreignField: "_id",
              as: "vendorDetails",
            },
          },
          {
            $lookup: {
              from: "promos",
              localField: "promoId",
              foreignField: "_id",
              as: "promoDetails",
            },
          },
        ],
        project: {
          "vendorDetails._id": 1,
          "vendorDetails.name": 1,
          "vendorDetails.brandLogo": 1,
          estimatedSavingPrice: 1,
          "promoDetails._id": 1,
          "promoDetails.offerPercentage": 1,
          totalBill: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      };
      const transactionsList = await this._transactionHistoryRepository.getAll(
        paginator
      );
      response.getRedemptionsResponse(transactionsList);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      response.internalServerErrorResponse(e);
    }
  };

  getNearVendors = async (req, res) => {
    const response = new UserResponse(req, res);

    try {
      let { longitude, latitude, page, pageSize } = req.query;
      const cods = [parseFloat(longitude), parseFloat(latitude)];

      if (pageSize > 100) {
        pageSize = 100;
      }

      const paginator = {
        page,
        pageSize,
        filters: {
          geonear: {
            near: { type: "Point", coordinates: cods },
            distanceField: "distance.calculated",
            maxDistance: 10000,
            includeLocs: "distance.location",
          },
        },
        project: {
          name: 1,
          subCategory: 1,
          brandLogo: 1,
          distance: 1,
        },
      };
      const vendorList = await this._vendorRepository.getAll(paginator);
      response.getNearVendorsResponse(vendorList);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      response.internalServerErrorResponse(e);
    }
  };
}

module.exports = new UserController();
