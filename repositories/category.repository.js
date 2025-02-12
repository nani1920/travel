/** @format */

const BaseRepository = require("./_base.repository.js");
const CategoryModel = require("../models/category.model");

module.exports = class CategoryRepository extends BaseRepository {
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
    return CategoryModel.find(query)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit);
  }

  async findById(id) {
    return CategoryModel.findById(id);
  }

  async findOne(query, select = null) {
    return CategoryModel.findOne(query).select(select);
  }

  async createOrUpdateById(id, data) {
    if (id) {
      return CategoryModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      ).session(this._session);
    }
    return await new CategoryModel(data).save({ session: this._session });
  }

  getModelRef() {
    return CategoryModel;
  }

  async getAll(paginator) {
    const pipeline = [];
    return this.paginate({
      model: CategoryModel,
      aggregation: pipeline,
      pageNumber: paginator.page,
      sort: paginator.sort,
      filters: paginator.filters,
      lookup: paginator.lookup || [],
    });
  }
};
