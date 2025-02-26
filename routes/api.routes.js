/** @format */

const express = require("express");
const Route = express.Router();

/**
 *
 * Bad Request Error Response
 * @typedef {object} BadRequestResponse
 * @property {number} status -status code
 * @property {string} statusText - status code in text
 * @property {string} statusText - error message
 *
 */
/**
 * Internal Server Error Response
 * @typedef {object} internalServerErrorResponse
 * @property {string} url -url
 * @property {number} status - status code
 * @property {string} statusText - error message
 */

/* Local files*/
const upload = require("../config/fileUpload");
/*End Local files*/

/* Middleware*/
const ApiMiddleware = require("../http/middlewares/api");
/* End Middleware*/

/* Requests*/
const UserRequest = require("../http/requests/api/user.request");
const ProductRequest = require("../http/requests/api/product.request");
/* End Requests*/

/* Controllers*/
const UserController = require("../http/controllers/api/user.controller");
const CategoryController = require("../http/controllers/api/category.controller");
const ProductController = require("../http/controllers/api/product.controller");
const VendorController = require("../http/controllers/api/vendor.controller");
/* End Controllers*/

/* Routes*/

/** USER Routes */
/**End USER Routes */

//
//
//

// Route.get(
//   "/vendors/top-brands",
//   ApiMiddleware.auth,
//   VendorController.getTopBrands
// );

/** Products Route */
/**Get Products Badge Route */
// Route.get(
//   "/products/badges", //http://localhost:3000/api/products/badges?badgeType=NEW&badgeType=Top Choice
//   ApiMiddleware.auth,
//   ProductRequest.validateBadgeRequest(),
//   ProductController.getProducts
// );

// /**Get TopBrands Route */
// Route.get(
//   "/products/top-brands",
//   ApiMiddleware.auth,
//   ProductController.getTopBrands
// );
// /**Get products with subCategories Route */
// Route.get(
//   "/products", // "http://localhost:3000/products?subCategory=Theme Park"
//   ApiMiddleware.auth,
//   // ProductRequest.validateSubcategoryRequest(),
//   ProductController.getSubcategories
// );
/** End Products Route */

Route.use(ApiMiddleware.auth);
/** Get Categories Route */
Route.get("/categories/:categoryId?", CategoryController.getCategories);
/**End Get Categories Route */

/**Vendor Routes */
Route.get("/vendors", UserController.getVendors);
Route.get("/vendors/:vendorId", UserController.getVendor);
/**End Vendor Routes */

/**Update Profile Routes */
Route.put(
  "/update-profile",
  UserRequest.updateProfileRequest(),
  UserController.updateProfile
);
/** End Update Profile Routes */

/** Reviews Routes */
Route.get("/reviews/:vendorId", UserController.getReviews);
Route.post(
  "/reviews",
  UserRequest.postReviewRequest(),
  UserController.postReview
);
/** End Reviews Routes */

module.exports = Route;
