/** @format */

const httpContext = require("express-http-context");
const url = require("url");
const HTTP_STATUS_CODE = require("http-status-codes");
const STATUS_CODES = HTTP_STATUS_CODE.StatusCodes;
const REASON_PHRASES = HTTP_STATUS_CODE.ReasonPhrases;
module.exports = class BaseResponse {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  unauthorizedResponse(errors) {
    const response = this._schema({
      status: STATUS_CODES.UNAUTHORIZED,
      statusText: REASON_PHRASES.UNAUTHORIZED,
      messages: errors.message || errors,
    });
    return this.res.status(STATUS_CODES.UNAUTHORIZED).json(response);
  }

  internalServerErrorResponse(error) {
    console.log(error);
    const response = this._schema({
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      statusText: REASON_PHRASES.INTERNAL_SERVER_ERROR,
      messages: error.stack, //error.message // For Production do "Something went wrong!"
    });
    return this.res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(response);
  }

  redirectResponse(url) {
    return this.res.redirect(STATUS_CODES.MOVED_TEMPORARILY, url);
  }

  badRequestResponse(errors) {
    const response = this._schema({
      status: STATUS_CODES.BAD_REQUEST,
      statusText: REASON_PHRASES.BAD_REQUEST,
      messages: Array.isArray(errors)
        ? errors.map((error) => this.req.t(error))
        : [this.req.t(errors.message)],
    });
    return this.res.status(STATUS_CODES.BAD_REQUEST).json(response);
  }

  okResponse(data) {
    // console.log(data);
    const response = this._schema({
      status: STATUS_CODES.OK,
      statusText: REASON_PHRASES.OK,
      data,
    });
    return this.res.status(HTTP_STATUS_CODE.StatusCodes.OK).json(response);
  }

  _schema({ statusText, status, ...rest }) {
    return {
      status,
      statusText,
      ...rest,
      meta: {
        requestId: httpContext.get("_reqId"),
        url: this._parseUrl(),
      },
    };
  }

  _parseUrl() {
    return url.format({
      protocol: this.req.protocol,
      host: this.req.get("host"),
      pathname: this.req.path,
      query: this.req.query,
    });
  }
};
