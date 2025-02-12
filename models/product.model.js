/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductModel = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Vendor",
  },
  bannerImg: {
    type: String,
    default: null,
  },
  category: {
    categoryId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Category",
    },
    name: {
      type: String,
      default: null,
    },
  },
  subCategory: {
    type: String,
    default: null,
  },
  discountPercentage: {
    type: String,
    default: null,
  },
  badges: [
    {
      noOfLocations: {
        type: Number,
        default: null,
      },
      badgeType: {
        type: String,
        enum: ["NEW", "Top Choice"],
        default: null,
      },
    },
  ],
  promos: [
    {
      offerPercentage: {
        type: String,
        default: null,
      },
      promoTitle: {
        type: String,
        default: null,
      },
      promoDescription: {
        type: String,
        default: null,
      },
    },
  ],
});

module.exports = mongoose.model("Product", ProductModel);
