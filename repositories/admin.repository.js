const BaseRepository = require('./_base.repository');
const AdminModel = require('../models/admin.model');

module.exports = class AdminRepository extends BaseRepository{
    constructor(){
        super()
    }

    async find(query, select = null, populate = null,sort= { createdAt: -1 },limit = null){
        return AdminModel.find(query).select(select).populate(populate).sort(sort).limit(limit)
    }

    async findById(id) {
        return AdminModel.findById(id)
    }

    async findOne(query, select = null) {
        return AdminModel.findOne(query).select(select)
    }

    async createOrUpdateById(id, data) {
        if (id) {
            return AdminModel.findByIdAndUpdate(id,{...data}, {new: true}).session(this._session)
        }
        return (await new AdminModel(data).save({session: this._session}))
    }

    getModelRef(){
        return AdminModel
    }

    async getAll(paginator) {
        const pipeline = [];
        return this.paginate({
            model: AdminModel,
            aggregation: pipeline,
            pageNumber: paginator.page,
            sort: paginator.sort,
            filters: paginator.filters,
            lookup: paginator.lookup || []
        })
    }

}