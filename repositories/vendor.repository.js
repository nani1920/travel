/** @format */

const BaseRepository = require("./_base.repository.js");
const VendorModel = require("../models/vendor.model.js"); // Use CategoryModel instead of UserModel

module.exports = class VendorRepository extends BaseRepository {
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
    return VendorModel.find(query)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit);
  }

  async findById(id, select = null) {
    return VendorModel.findById(id).select(select);
  }

  async findOne(query, select = null) {
    return VendorModel.findOne(query).select(select);
  }

  async createOrUpdateById(id, data) {
    if (id) {
      return VendorModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      ).session(this._session);
    }
    return await new VendorModel(data).save({ session: this._session });
  }

  getModelRef() {
    return VendorModel;
  }

  async getAll(paginator) {
    const pipeline = [];
    return this.paginate({
      model: VendorModel,
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

  async aggregation(aggregate = null) {
    return VendorModel.aggregate(aggregate);
  }
};
