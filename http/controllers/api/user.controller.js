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

class UserController extends BaseController {
  constructor() {
    super();
  }

  uploadDocument = async (req, res) => {
    const response = new UserResponse(req, res);
    try {
      const { studentIdDocument } = req.body;
      let user = req.user;
      user = await this._userRepository.createOrUpdateById(user._id, {
        userIdDocument: studentIdDocument,
      });
      const userData = _.pick(user, ["fullName", "userIdDocument"]);
      return response.sendDocumentUploadResponse({
        message: "Document Uploaded Successfully",
        userData,
      });
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  };
}

module.exports = new UserController();
