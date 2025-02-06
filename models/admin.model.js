/* Third Party Libraries */
const path = require('path');
/* Third Party Libraries */

/* Local Files */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* Local Files */

let AdminModel = new Schema({
    fullName: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        default: null,
    },
    avatar: {
        type: String,
        default: null,
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        default: null
    },
    role: {
        type: String,
        default: null
    },
    permissions: [{
        type: String,
        default: null
    }],
    permissionsId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission',
            default: null
        }
    ],
    twoFaCode: {
        type: String,
        default: null
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});


const secret = process.env.JWT_SECRET

AdminModel.methods.generateToken = function () {
    let auth = this;
    const access = "auth";
    const token = jwt.sign({
        _id: auth._id.toHexString(),
        access,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), /// 30 Days
    }, secret).toString();

    auth.tokens.push({
        access,
        token
    });

    return auth.save().then(() => {
        return auth;
    });
};

AdminModel.statics.refreshToken = function (user) {
    const access = "auth";
    const token = jwt.sign({
        _id: user._id.toHexString(),
        access,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30), /// 30 Days
    }, secret).toString();

    user.tokens = [{
        access,
        token
    }];
    return this.findByIdAndUpdate(user._id, user, { new: true });
};

AdminModel.statics.findByToken = function (token) {
    const auth = this;
    const decoded = jwt.verify(token, secret);
    return auth.findOne({
        "_id": decoded._id,
        "tokens.token": token,
    });
};


AdminModel.index({ email: 1 });
AdminModel.index({ phone: 1 });
AdminModel.index({ fullName: 1 });
AdminModel.index({ role: 1 });


module.exports = mongoose.model("Admin", AdminModel);
