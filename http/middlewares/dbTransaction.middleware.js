/**
 * Third Party Libraries
 *
 * @format
 */

const db = require("mongoose");
/* Third Party Libraries */

/* Local Files */
const Helper = require("../../helpers/helpers");
/* Local Files */

/* Controllers */
/* End Controllers */

class DbTransactionHelper {
  async transaction(req, res, next) {
    const session = await db.startSession();
    session.startTransaction();
    console.log("DB Transaction: {Started}.");
    try {
      req.dbSession = session;
      res.on("finish", async function () {
        if (res.statusCode > 400) {
          await session.abortTransaction();
          console.log("DB Transaction: {Aborted}.");
          session.endSession();
        } else {
          await session.commitTransaction();
          console.log("DB Transaction: {Committed}.");
          session.endSession();
        }
      });
      next();
    } catch (e) {
      Helper.getAuthErrorMessage(res, e ? e.message : "DB Transaction error");
    }
  }
}

module.exports = new DbTransactionHelper();
