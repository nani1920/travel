const BaseRepository = require('./_base.repository');
const TripModel = require('../models/trip.model');

module.exports = class TripRepository extends BaseRepository{
    constructor(){
        super()
    }

    async find(query, select = null, populate = null,sort= { createdAt: -1 },limit = null){
        return TripModel.find(query).select(select).populate(populate).sort(sort).limit(limit)
    }

    async findById(id) {
        return TripModel.findById(id)
    }

    async findOne(query, select = null) {
        return TripModel.findOne(query).select(select)
    }

    async createOrUpdateById(id, data) {
        if (id) {
            return TripModel.findByIdAndUpdate(id,{...data}, {new: true}).session(this._session)
        }
        return (await new TripModel(data).save({session: this._session}))
    }

    getModelRef(){
        return TripModel
    }

    async getAll(paginator) {
        const pipeline = [];
        return this.paginate({
            model: TripModel,
            aggregation: pipeline,
            pageNumber: paginator.page,
            sort: paginator.sort,
            filters: paginator.filters,
            lookup: paginator.lookup || []
        })
    }

}