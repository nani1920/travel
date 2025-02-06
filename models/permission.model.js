/* Third Party Libraries */
const path = require('path');
const { v4: uuidv4 } = require('uuid');
/* Third Party Libraries */

/* Local Files */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* Local Files */

const PermissionModel = new Schema({
    key: {
        type: String,
        default: () => uuidv4() + `-${new Date().getTime()}`,
        unique: true
    },
    name: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});

PermissionModel.index({id: 1});

module.exports = mongoose.model('Permission', PermissionModel);