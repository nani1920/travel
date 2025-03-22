/** @format */

const BaseRepository = require("./_base.repository.js");
const TransactionHistoryModel = require("../models/transactionHistory.model.js");

module.exports = class TransactionHistoryRepository extends BaseRepository {
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
    return TransactionHistoryModel.find(query)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit);
  }

  async findById(id, select = null) {
    return TransactionHistoryModel.findById(id).select(select);
  }

  async findOne(query, select = null) {
    return TransactionHistoryModel.findOne(query).select(select);
  }

  async createOrUpdateById(id, data) {
    if (id) {
      return TransactionHistoryModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }
      ).session(this._session);
    }
    return await new TransactionHistoryModel(data).save({
      session: this._session,
    });
  }

  getModelRef() {
    return TransactionHistoryModel;
  }

  async getAll(paginator) {
    const pipeline = [];
    return this.paginate({
      model: TransactionHistoryModel,
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
    return TransactionHistoryModel.aggregate(aggregate);
  }
};
