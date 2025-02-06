const BaseRepository = require('./_base.repository');
const RoleModel = require('../models/role.model');

module.exports = class RoleRepository extends BaseRepository{
    constructor(){
        super()
    }

    async find(query, select = null, populate = null,sort= { createdAt: -1 },limit = null){
        return RoleModel.find(query).select(select).populate(populate).sort(sort).limit(limit)
    }

    async findById(id) {
        return RoleModel.findById(id)
    }

    async findOne(query, select = null) {
        return RoleModel.findOne(query).select(select)
    }

    async createOrUpdateById(id, data) {
        if (id) {
            return RoleModel.findByIdAndUpdate(id,{...data}, {new: true}).session(this._session)
        }
        return (await new RoleModel(data).save({session: this._session}))
    }

    getModelRef(){
        return RoleModel
    }

    async getAll(paginator) {
        const pipeline = [];
        return this.paginate({
            model: RoleModel,
            aggregation: pipeline,
            pageNumber: paginator.page,
            sort: paginator.sort,
            filters: paginator.filters,
            lookup: paginator.lookup || []
        })
    }

}