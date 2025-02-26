/** @format */

const BaseRepository = require("./_base.repository.js");
const SubCategoryModel = require("../models/subCategory.model");

module.exports = class SubCategoryRepository extends BaseRepository {
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
    return SubCategoryModel.find(query)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit);
  }

  async findById(id) {
    return SubCategoryModel.findById(id);
  }

  async findOne(query, select = null) {
    return SubCategoryModel.findOne(query).select(select);
  }

  async createOrUpdateById(id, data) {
    if (id) {
      return SubCategoryModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      ).session(this._session);
    }
    return await new SubCategoryModel(data).save({ session: this._session });
  }

  getModelRef() {
    return SubCategoryModel;
  }

  async getAll(paginator) {
    const pipeline = [];
    console.log(paginator);
    return this.paginate({
      model: SubCategoryModel,
      aggregation: pipeline,
      pageNumber: paginator.page,
      pageSize: paginator.size,
      sort: paginator.sort,
      filters: paginator.filters,
      lookup: paginator.lookup || [],
    });
  }
};
