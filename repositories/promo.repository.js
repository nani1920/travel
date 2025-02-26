/** @format */

const BaseRepository = require("./_base.repository.js");
const PromoModel = require("../models/promo.model");

module.exports = class PromoRepository extends BaseRepository {
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
    return PromoModel.find(query)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit);
  }

  async findById(id) {
    return PromoModel.findById(id);
  }

  async findOne(query, select = null) {
    return PromoModel.findOne(query).select(select);
  }

  async createOrUpdateById(id, data) {
    if (id) {
      return PromoModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      ).session(this._session);
    }
    return await new PromoModel(data).save({ session: this._session });
  }

  getModelRef() {
    return PromoModel;
  }

  async getAll(paginator) {
    const pipeline = [];
    return this.paginate({
      model: PromoModel,
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
