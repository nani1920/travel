/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubCategoryModel = new Schema({
  name: {
    type: String,
    default: null,
  },
  imgUrl: {
    type: String,
    default: null,
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    default: null,
  },
});

module.exports = mongoose.model("SubCategory", SubCategoryModel);
