/** @format */

require("dotenv");
/* Helpers */
const Helper = require("../../helpers/helpers");
/* End Helpers*/

/* Models */
const UserModel = require("../../models/user.model");
/* End Models*/

/* Responses */
const ValidationResponse = require("../responses/validation.response");
/* End Response */

class ApiMiddleware {
  async auth(req, res, next) {
    const response = new ValidationResponse(req, res);
    try {
      const token = req.header("authorization").split(" ")[1];
      const user = await UserModel.findByToken(token);
      if (!user) {
        throw new Error(req.t("unauthorized"));
      }
      if (!user.isLoginOtpVerified) {
        throw new Error(req.t("user_is_not_verified"));
      }
      req.user = user;
      next();
    } catch (e) {
      console.log(e, "IN API auth middleware");
      return response.middlewareError(req.t(e));
    }
  }

  async webhookAuth(req, res, next) {
    const response = new ValidationResponse(req, res);
    try {
      const secretKey = req.header("authorization").split(" ")[1];
      if (secretKey !== process.env.WEBHOOK_PRIVATE_KEY) {
        throw new Error("Invalid Key");
      }
      next();
    } catch (e) {
      console.log(e, "IN API auth middleware");
      return response.middlewareError(req.t("unauthorized"));
    }
  }
}

module.exports = new ApiMiddleware();
