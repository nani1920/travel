/* Third Party Libraries */
const mongoose = require('mongoose')
/* Third Party Libraries */

/* Local Files */
/* Local Files */

/* Controllers */
/* End Controllers */

class ModelHelper {
    checkIdInModel({
        model,
        user,
        field,
        provider,
        customQuery
    }) {
        const availableModels = [
            'Job',
            'Candidate',
            'JobSahayak',
            'JobWahanPartner',
            'JobSevaKendra',
            'JwpTask',
            'JobCategory',
            'Notification'
        ];

        if (!availableModels.includes(model)) {
            throw new Error('Model not found');
        }
        return async (value, {
            req
        }) => {
            const ModelName = mongoose.model(model);

            let query = {
                _id: value
            }

            if (field) {
                query[field] = value
            }

            if (user) {
                query.user = req.user._id
            }

            if (provider) {
                query.serviceProvider = req.user._id
            }

            if (customQuery) {
                query = {
                    ...query,
                    ...customQuery
                }
            }
            const data = await ModelName.findOne(query);
            if (!data) {
                throw new Error(`${model} id not found`);
            }
            req[model] = data;
            return true;
        }
    }
}

module.exports = new ModelHelper();
