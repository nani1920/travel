/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorModel = new Schema({
  name: {
    type: String,
    default: null,
  },
  desc: {
    type: String,
    default: null,
  },
  brandLogo: {
    type: String,
    default: null,
  },
  isTopBrand: {
    type: Boolean,
    default: false,
  },
  location: {
    latitude: {
      type: String,
      default: null,
    },
    longitude: {
      type: String,
      default: null,
    },
  },
  reviews: [
    {
      userName: {
        type: String,
        default: null,
      },
      rating: {
        type: Number,
        required: true,
      },
      reviewText: {
        type: String,
        default: null,
      },
    },
  ],
});

module.exports = mongoose.model("Vendor", VendorModel);
