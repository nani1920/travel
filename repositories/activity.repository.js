const BaseRepository = require('./_base.repository');
const ActivityModel = require('../models/activity.model');

module.exports = class ActivityRepository extends BaseRepository{
    constructor(){
        super()
    }

    async find(query, select = null, populate = null,sort= { createdAt: -1 },limit = null){
        return ActivityModel.find(query).select(select).populate(populate).sort(sort).limit(limit)
    }

    async findById(id) {
        return ActivityModel.findById(id)
    }

    async findOne(query, select = null) {
        return ActivityModel.findOne(query).select(select)
    }

    async createOrUpdateById(id, data) {
        if (id) {
            return ActivityModel.findByIdAndUpdate(id,{...data}, {new: true}).session(this._session)
        }
        return (await new ActivityModel(data).save({session: this._session}))
    }

    getModelRef(){
        return ActivityModel
    }

    async getAll(paginator) {
        const pipeline = [];
        return this.paginate({
            model: ActivityModel,
            aggregation: pipeline,
            pageNumber: paginator.page,
            sort: paginator.sort,
            filters: paginator.filters,
            lookup: paginator.lookup || []
        })
    }

}