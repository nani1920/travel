/** @format */

const BaseRepository = require("./_base.repository");
const UserModel = require("../models/user.model");

module.exports = class UserRepository extends BaseRepository {
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
    return UserModel.find(query)
      .select(select)
      .populate(populate)
      .sort(sort)
      .limit(limit);
  }

  async findById(id) {
    return UserModel.findById(id);
  }

  async findOne(query, select = null) {
    return UserModel.findOne(query).select(select);
  }

  async createOrUpdateById(id, data, select = null) {
    if (id) {
      return UserModel.findByIdAndUpdate(id, { ...data }, { new: true })
        .select(select)
        .session(this._session);
    }
    return (
      await new UserModel(data).save({ session: this._session })
    ).generateToken();
  }

  getModelRef() {
    return UserModel;
  }

  async getAll(paginator) {
    const pipeline = [];
    return this.paginate({
      model: UserModel,
      aggregation: pipeline,
      pageNumber: paginator.page,
      sort: paginator.sort,
      filters: paginator.filters,
      lookup: paginator.lookup || [],
    });
  }
};
