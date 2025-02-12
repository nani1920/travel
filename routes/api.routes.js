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
/* End Controllers*/

/* Routes*/

/** USER Routes */
/**End USER Routes */

/** Get Categories Route */
Route.get("/categories", ApiMiddleware.auth, CategoryController.getCategories);
/**End Get Categories Route */

/** Products Route */
/**Get Products Badge Route */
Route.get(
  "/products/badges", //http://localhost:3000/api/products/badges?badgeType=NEW&badgeType=Top Choice
  ApiMiddleware.auth,
  ProductRequest.validateBadgeRequest(),
  ProductController.getProducts
);

/**Get TopBrands Route */
Route.get(
  "/products/top-brands",
  ApiMiddleware.auth,
  ProductController.getTopBrands
);
/**Get products with subCategories Route */
Route.get(
  "/products", // "http://localhost:3000/products?subCategory=Theme Park"
  ApiMiddleware.auth,
  // ProductRequest.validateSubcategoryRequest(),
  ProductController.getSubcategories
);
/** End Products Route */

module.exports = Route;
