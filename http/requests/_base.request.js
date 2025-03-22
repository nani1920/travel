/** @format */

const ValidationResponse = require("../responses/validation.response");
const { validationResult } = require("express-validator");

const repositories = require("../../repositories");
const _ = require("lodash");
module.exports = class BaseRequest {
  // use the repositories in constructor
  constructor() {
    this._adminRepository = new repositories.AdminRepository();
    this._userRepository = new repositories.UserRepository();
    this._tripRepository = new repositories.TripRepository();
    this._activityRepository = new repositories.ActivityRepository();
    this._amenityRepository = new repositories.AmenityRepository();
    this._roleRepository = new repositories.RoleRepository();
    this._permissionRepository = new repositories.PermissionRepository();
    this._categoryRepository = new repositories.CategoryRepository();
    this._productRepository = new repositories.ProductRepository();
    this._vendorRepository = new repositories.VendorRepository();
    this._subCategoryRepository = new repositories.SubCategoryRepository();
    this._promoRepository = new repositories.PromoRepository();
    this._RatingRepository = new repositories.RatingRepository();
    this._transactionHistoryRepository =
      new repositories.TransactionHistoryRepository();
  }

  validate(req, res, next) {
    const messages = [];
    if (!validationResult(req).isEmpty()) {
      const errors = validationResult(req).array();
      for (const i of errors) {
        const message = `${i.msg}`;
        if (!messages.includes(message)) {
          messages.push(message);
        }
      }
      return new ValidationResponse(req, res).validationError(messages);
    }
    next();
  }
};
