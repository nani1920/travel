/**
 * Third Party Libraries
 *
 * @format
 */

/* Local Files */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/* Local Files */

const TransactionHistoryModel = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "User",
    },
    vendorId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "Vendor",
    },
    promoId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "Promo",
    },
    estimatedSavingPrice: {
      type: Number,
      default: 0,
    },
    totalBill: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transactionHistory", TransactionHistoryModel);
