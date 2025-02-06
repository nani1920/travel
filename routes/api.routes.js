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
/* End Requests*/

/* Controllers*/
const UserController = require("../http/controllers/api/user.controller");
/* End Controllers*/

/* Routes*/

/** USER Routes */

Route.post(
  "/update/user",
  ApiMiddleware.auth,
  UserRequest.validateDocument(),
  UserController.uploadDocument
);
/**End USER Routes */

module.exports = Route;
