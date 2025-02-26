/**
 * Third Party Libraries
 *
 * @format
 */

const _ = require("lodash");
const db = require("mongoose");
const { check, validationResult } = require("express-validator");
/* Third Party Libraries */

/* Responses */
const FileResponse = require("../responses/file.response");
/* End Responses */

/* Exceptions */
const BadRequestError = require("../../exceptions/badRequest.exception");
/* End Exceptions */

/* Models */
/* End Models */

class FileController {
  expectedFiles() {
    return [
      "vehicleFrontImage",
      "vehicleBackImage",
      "storeFrontImage",
      "avatar",
      "categoryImage",
      "groupImage",
    ];
  }

  async uploadFiles(req, res) {
    const response = new FileResponse(req, res);
    try {
      if (!req["files"] || _.isEmpty(req["files"])) {
        throw new BadRequestError("Files required.");
      }
      const files = Object.keys(req.files)
        .map((key) => {
          console.log(req.files[key]);
          // return { [key]: req.files[key].map(file => file.filename) }; // For local storage
          return { [key]: req.files[key].map((file) => file.location) }; // For S3 Storage
        })
        .reduce((prev, curr) => {
          return { ...prev, ...curr };
        });
      return response.postDataResponse(files);
    } catch (e) {
      if (e instanceof BadRequestError) {
        return response.badRequestResponse(e);
      }
      return response.internalServerErrorResponse(e);
    }
  }
}
module.exports = new FileController();
