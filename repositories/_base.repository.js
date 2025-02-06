module.exports = class BaseRepository {
    constructor() {
        this._session = null
    }

    setDBSession(session) {
        this._session = session;
    }


    paginate = async ({
        model,
        sort = { field: 'createdAt', order: -1 },
        aggregation = [],
        pageNumber = 1,
        pageSize = 20,
        filters = {},
        searchFilter = [],
        project = null,
        addFields = null
    }) => {
        try {

            // if (filters.length > 0) {
            //     //TODO: Add Filter
            //     filters.forEach(filter => {
            //         aggregation.unshift({
            //             $match: {
            //                 // [filter.field]: { $regex: "" }
            //                 [filter.field]: filter.key
            //             }
            //         })
            //     });
            // }

            // if (searchFilter.length > 0) {
            //     //TODO: Add Filter
            //     let search = []
            //     searchFilter.forEach(filter => {
            //         search.push({[filter.field]: {
            //             $regex: filter.key,
            //             $options: "i"
            //         }})
            //     });
            //     aggregation.unshift({
            //         $match: {
            //            $or:search
            //         }
            //     })
            // }

            if (filters.hasOwnProperty('match')) {
                aggregation.unshift({

                    $match: filters['match']

                })
            }
            if (filters.hasOwnProperty('geonear')) {
                aggregation.unshift({

                    $geoNear: filters['geonear']

                })
            }
            if(project){
                aggregation.push({
                    $project:project
                })
            }

            if(addFields){
                aggregation.push({
                    $addFields:addFields
                })
            }
            const countPipeline = [...aggregation, { $count: 'totalDocuments' }];
            const countResult = await model.aggregate(countPipeline);

            const totalDocuments = countResult.length > 0 ? countResult[0].totalDocuments : 0;
            const totalPages = Math.ceil(totalDocuments / pageSize);
            if (pageNumber < 1) {
                throw new Error('Invalid page number');
            }



            const pipeline = [
                ...aggregation,
                { $skip: (pageNumber - 1) * pageSize },
                { $limit: pageSize },
                { $sort: { [sort.field]: sort.order } }
            ];
            const documents = await model.aggregate(pipeline);

            return {
                pageNumber,
                pageSize,
                totalPages,
                totalDocuments,
                documents
            };
        } catch (error) {
            throw new Error(`Pagination failed: ${error.message}`);
        }
    };


}