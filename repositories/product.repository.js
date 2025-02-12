/** @format */

const BaseRepository = require("./_base.repository.js");
const ProductModel = require("../models/product.model.js"); // Use CategoryModel instead of UserModel

module.exports = class ProductRepository extends BaseRepository {
  constructor() {
    super();
  }

  async find(
    query,
    select = null,
    populate = null,
    sort = { createdAt: -1 },
    limit = null
  ) {
    return ProductModel.find(query)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit);
  }

  async findById(id) {
    return ProductModel.findById(id);
  }

  async findOne(query, select = null) {
    return ProductModel.findOne(query).select(select);
  }

  async createOrUpdateById(id, data) {
    if (id) {
      return ProductModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      ).session(this._session);
    }
    return await new ProductModel(data).save({ session: this._session });
  }

  getModelRef() {
    return ProductModel;
  }

  async getAll(paginator) {
    const pipeline = [];
    return this.paginate({
      model: ProductModel,
      aggregation: pipeline,
      pageNumber: paginator.page,
      sort: paginator.sort,
      filters: paginator.filters,
      lookup: paginator.lookup || [],
    });
  }
};
