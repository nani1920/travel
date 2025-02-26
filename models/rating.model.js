/** @format */
/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const VendorModel = require("./vendor.model");

const RatingModel = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "User",
    },
    rating: {
      type: Number,
      default: null,
    },
    review: {
      type: String,
      default: null,
    },
    vendorId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "Vendor",
    },
  },
  {
    timestamps: true,
  }
);

RatingModel.post("save", async function (doc) {
  try {
    const vendor = await VendorModel.findById(doc.vendorId);
    if (vendor) {
      const updatedTotalReviews = vendor.totalReviews + 1;
      const updatedAvgRating =
        (vendor.avgRating * vendor.totalReviews + doc.rating) /
        updatedTotalReviews;

      vendor.avgRating = Math.round(updatedAvgRating * 10) / 10;
      vendor.totalReviews = updatedTotalReviews;
      await vendor.save();
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = mongoose.model("Rating", RatingModel);
