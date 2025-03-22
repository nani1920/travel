/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorModel = new Schema(
  {
    name: {
      type: String,
      default: null,
    },
    desc: {
      type: String,
      default: null,
    },
    bannerImg: {
      type: String,
      default: null,
    },
    brandLogo: {
      type: String,
      default: null,
    },
    discountPercentage: {
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
      subCategoryId: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: "SubCategory",
      },
      name: {
        type: String,
        default: null,
      },
    },
    noOfLocations: {
      type: Number,
      default: null,
    },
    badges: [
      {
        badgeType: {
          type: String,
          enum: ["NEW", "Top Choice", "Trending"],
          default: null,
        },
      },
    ],
    isTopBrand: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    locations: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0.0, 0.0],
      },
    },
    phone: {
      type: Number,
      default: null,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    pin: {
      type: Number,
      default: 1234, // change this value default to null
      minlength: 4,
      maxlength: 4,
    },
    // reviews: [
    //   {
    //     userName: {
    //       type: String,
    //       default: null,
    //     },
    //     rating: {
    //       type: Number,
    //       required: true,
    //     },
    //     reviewText: {
    //       type: String,
    //       default: null,
    //     },
    //   },
    // ],
    // promos: [
    //   {
    //     offerPercentage: {
    //       type: String,
    //       default: null,
    //     },
    //     promoTitle: {
    //       type: String,
    //       default: null,
    //     },
    //     promoDescription: {
    //       type: String,
    //       default: null,
    //     },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

VendorModel.index({ locations: "2dsphere" });
module.exports = mongoose.model("Vendor", VendorModel);
