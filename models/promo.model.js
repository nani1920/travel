/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromoModel = new Schema({
  promoTitle: {
    type: String,
    default: null,
  },
  promoDescription: {
    type: String,
    default: null,
  },
  offerPercentage: {
    type: String,
    default: null,
  },
  vendorId: {
    type: mongoose.Types.ObjectId,
    default: null,
    ref: "Vendor",
  },
  isAvailableInStore: {
    type: Boolean,
    default: false,
  },
  isAvailableInAllBranches: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Promo", PromoModel);
