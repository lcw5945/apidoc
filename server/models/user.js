import baseModel from './base-model';
import _ from 'lodash';

var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
    },
    authority: Number,
    regTime: String,
    loginTime: String,
    ssoUser: Object
}, {versionKey: false});

UserSchema.statics = _.merge(baseModel, {
    /*fetch: function (conditions, cb) {
        return this
            .find(conditions)
            .sort({regTime: 'desc'})
            .exec(cb);
    },
    findByUsrName(userName, cb) {
        return this.findOne({userName: userName}), exec(cb);
    },
    findByMulId(ids, cb) {
        return this.find({_id: {'$in': ids}})
            .exec(cb);
    },
    createInfo: function (user, cb) {
        return this
            .create(user, cb);
    },
    updateInfo: function (id, doc, cb) {
        let conditions = {_id: id};
        let options = {};
        let update = {$set: doc};
        return this
            .update(conditions, update, options, cb);
    },
    updateByOpts: function (conditions, doc, cb) {
        let options = {};
        let update = {$set: doc};
        return this
            .update(conditions, update, options, cb);
    },
    login(user, cb) {
        return this
            .findOne(user).exec(cb);
    },
    register: function (user, cb) {
        let _this = this;
        this.findOne({username: user.username}).then(function (doc) {
            if (doc) {
                cb("用户已注册", null);
            } else {
                _this.createInfo(user, cb);
            }
        })
    }*/
});

module.exports = mongoose.model('user', UserSchema, 'users');
