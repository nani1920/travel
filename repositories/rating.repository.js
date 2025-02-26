/** @format */

const BaseRepository = require("./_base.repository.js");
const RatingModel = require("../models/rating.model");

module.exports = class RatingRepository extends BaseRepository {
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
    return RatingModel.find(query)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit);
  }

  async findById(id) {
    return RatingModel.findById(id);
  }

  async findOne(query, select = null) {
    return RatingModel.findOne(query).select(select);
  }

  async createOrUpdateById(id, data) {
    if (id) {
      return RatingModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      ).session(this._session);
    }
    return await new RatingModel(data).save({ session: this._session });
  }

  getModelRef() {
    return RatingModel;
  }

  async getAll(paginator) {
    const pipeline = [];
    return this.paginate({
      model: RatingModel,
      sort: paginator.sort,
      aggregation: pipeline,
      pageNumber: paginator.page,
      pageSize: paginator.pageSize,
      filters: paginator.filters,
      lookup: paginator.lookup || [],
      project: paginator.project,
      addFields: paginator.addFields,
    });
  }
};
