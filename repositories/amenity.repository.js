const BaseRepository = require('./_base.repository');
const AmenityModel = require('../models/amenity.model');

module.exports = class AmenityRepository extends BaseRepository{
    constructor(){
        super()
    }

    async find(query, select = null, populate = null,sort= { createdAt: -1 },limit = null){
        return AmenityModel.find(query).select(select).populate(populate).sort(sort).limit(limit)
    }

    async findById(id) {
        return AmenityModel.findById(id)
    }

    async findOne(query, select = null) {
        return AmenityModel.findOne(query).select(select)
    }

    async createOrUpdateById(id, data) {
        if (id) {
            return AmenityModel.findByIdAndUpdate(id,{...data}, {new: true}).session(this._session)
        }
        return (await new AmenityModel(data).save({session: this._session}))
    }

    getModelRef(){
        return AmenityModel
    }

    async getAll(paginator) {
        const pipeline = [];
        return this.paginate({
            model: AmenityModel,
            aggregation: pipeline,
            pageNumber: paginator.page,
            sort: paginator.sort,
            filters: paginator.filters,
            lookup: paginator.lookup || []
        })
    }

}