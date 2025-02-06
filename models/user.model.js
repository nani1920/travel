/**
 * Third Party Libraries
 *
 * @format
 */

const path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
/* Third Party Libraries */

/* Local Files */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/* Local Files */

const UserModel = new Schema(
  {
    fullName: {
      type: String,
      default: null,
    },
    dob: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    // password: {
    //   type: String,
    //   default: null,
    // },
    countryCode: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    tokens: [
      {
        access: {
          type: String,
          required: true,
        },
        token: {
          type: String,
          required: true,
        },
      },
    ],
    twoFaCode: {
      type: String,
      default: null,
    },
    // isEmailOtpVerified: {
    //   type: String,
    //   default: false,
    // },
    isLoginOtpVerified: {
      type: Boolean,
      default: false,
    },
    userIdDocument: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const secret = process.env.JWT_SECRET;

UserModel.methods.generateToken = function () {
  let auth = this;
  const access = "auth";
  const token = jwt
    .sign(
      {
        _id: auth._id.toHexString(),
        access,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, /// 30 Days
      },
      secret
    )
    .toString();

  auth.tokens.push({
    access,
    token,
  });

  return auth.save().then(() => {
    return auth;
  });
};

UserModel.statics.refreshToken = function (user) {
  const access = "auth";
  const token = jwt
    .sign(
      {
        _id: user._id.toHexString(),
        access,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, /// 30 Days
      },
      secret
    )
    .toString();

  user.tokens = [
    {
      access,
      token,
    },
  ];
  return this.findByIdAndUpdate(user._id, user, { new: true });
};

UserModel.statics.findByToken = function (token) {
  const auth = this;
  const decoded = jwt.verify(token, secret);
  return auth.findOne({
    _id: decoded._id,
    "tokens.token": token,
  });
};

module.exports = mongoose.model("User", UserModel);
