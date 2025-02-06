/* Third Party Libraries */
const path = require('path');
const { v4: uuidv4 } = require('uuid');
/* Third Party Libraries */

/* Local Files */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require('../helpers/constants');
const { tripType } = constants;
/* Local Files */

const TripModel = new Schema({
    id: {
        type: String,
        default: () => uuidv4() + `-${new Date().getTime()}`,
        unique: true
    },
    organiserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    type: {
        type: Number,
        enum: Object.values(tripType),
        default: null
    },
    images: [{
        type: String,
        default: null
    }],
    description: {
        type: String,
        default: null
    },
    from: {
        name: {
            type: String,
            default: null
        },
        coords: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0.0, 0.0]
            }
        }
    },
    to: {
        name: {
            type: String,
            default: null
        },
        coords: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                default: [0.0, 0.0]
            }
        }
    },
    date: {
        type: Date,
        default: null
    },
    time: {
        type: String,
        default: null
    },
    stops: [
        {
            name: {
                type: String,
                default: null
            },
            coords: {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point'
                },
                coordinates: {
                    type: [Number],
                    default: [0.0, 0.0]
                }
            }
        }
    ],
    rules: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Rule',
            default: null
        }
    ],
    amenities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Amenity',
            default: null
        }
    ],
    activities: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Activity',
            default: null
        }
    ],
    seats: {
        type: Number,
        default: 0
    },
    bookedSeats: {
        type: Number,
        default: 0
    },
    pricePerSeat: {
        type: Number,
        default: 0
    },
    isRequestBasedApproval: {
        type: Boolean,
        default: false
    },
    isAutomaticApproval: {
        type: Boolean,
        default: false
    },
    recurringDate: {
        startDate: {
            type: Date,
            default: null
        },
        endDate: {
            type: Date,
            default: null
        },
    },
    recurring: [
        {
            day: {
                type: Number,
                default: null
            },
            time: {
                type: String,
                default: null
            }
        }
    ]

}, {
    timestamps: true
});

TripModel.index({"from.coords": "2dsphere"});
TripModel.index({"to.coords": "2dsphere"});
TripModel.index({"stops.coords": "2dsphere"});

module.exports = mongoose.model('Trip', TripModel);