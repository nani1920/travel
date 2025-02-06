const BaseRepository = require('./_base.repository');
const PermissionModel = require('../models/permission.model');

module.exports = class PermissionRepository extends BaseRepository{
    constructor(){
        super()
    }

    async find(query, select = null, populate = null,sort= { createdAt: -1 },limit = null){
        return PermissionModel.find(query).select(select).populate(populate).sort(sort).limit(limit)
    }

    async findById(id) {
        return PermissionModel.findById(id)
    }

    async findOne(query, select = null) {
        return PermissionModel.findOne(query).select(select)
    }

    async createOrUpdateById(id, data) {
        if (id) {
            return PermissionModel.findByIdAndUpdate(id,{...data}, {new: true}).session(this._session)
        }
        return (await new PermissionModel(data).save({session: this._session}))
    }

    getModelRef(){
        return PermissionModel
    }

    async getAll(paginator) {
        const pipeline = [];
        return this.paginate({
            model: PermissionModel,
            aggregation: pipeline,
            pageNumber: paginator.page,
            sort: paginator.sort,
            filters: paginator.filters,
            lookup: paginator.lookup || []
        })
    }

}