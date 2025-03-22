/** @format */

module.exports = class BaseRepository {
  constructor() {
    this._session = null;
  }

  setDBSession(session) {
    this._session = session;
  }

  paginate = async ({
    model,
    sort = { field: "createdAt", order: -1 },
    aggregation = [],
    pageNumber,
    pageSize,
    filters = {},
    lookup = [],
    project = null,
    addFields = null,
  }) => {
    try {
      pageNumber = Number(pageNumber) || 1;
      pageSize = Number(pageSize) || 20;

      if (filters.hasOwnProperty("match")) {
        aggregation.unshift({
          $match: filters["match"],
        });
      }
      if (filters.hasOwnProperty("group")) {
        aggregation.unshift({
          $group: filters["group"],
        });
      }

      if (filters.hasOwnProperty("geonear")) {
        aggregation.unshift({
          $geoNear: filters["geonear"],
        });
      }
      if (lookup && lookup.length > 0) {
        aggregation.push(...lookup);
      }

      if (addFields) {
        aggregation.push({
          $addFields: addFields,
        });
      }

      if (project) {
        aggregation.push({
          $project: project,
        });
      }
      const countPipeline = [...aggregation, { $count: "totalDocuments" }];
      const countResult = await model.aggregate(countPipeline);

      const totalDocuments =
        countResult.length > 0 ? countResult[0].totalDocuments : 0;
      const totalPages = Math.ceil(totalDocuments / pageSize);
      if (pageNumber < 1) {
        throw new Error("Invalid page number");
      }

      const pipeline = [
        ...aggregation,
        { $skip: (pageNumber - 1) * pageSize },
        { $limit: pageSize },
        { $sort: { [sort.field]: sort.order } },
      ];
      const documents = await model.aggregate(pipeline);

      return {
        pageNumber,
        pageSize,
        totalPages,
        totalDocuments,
        documents,
      };
    } catch (error) {
      throw new Error(`Pagination failed: ${error.message}`);
    }
  };
};
