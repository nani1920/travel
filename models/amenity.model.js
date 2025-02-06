/* Third Party Libraries */
const path = require('path');
const { v4: uuidv4 } = require('uuid');
/* Third Party Libraries */

/* Local Files */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* Local Files */

const AmenityModel = new Schema({
    id: {
        type: String,
        default: () => uuidv4() + `-${new Date().getTime()}`,
        unique: true
    },
    name: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Amenity', AmenityModel);