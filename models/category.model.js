/**
 * Third Party Libraries
 *
 * @format
 */

/* Local Files */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/* Local Files */

const CategoryModel = new Schema({
  name: {
    type: String,
    default: null,
  },
  bannerImg: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Category", CategoryModel);
