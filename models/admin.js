import baseModel from './base-model';
import _ from 'lodash';

var mongoose = require('mongoose');
var AdminSchema = new mongoose.Schema({
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
    loginTime: String
}, {versionKey: false});

AdminSchema.statics = _.merge(baseModel, {
    fetch: function (cb) {
        return this
            .find({authority:2})
            .sort({'name': 'asc'})
            .exec(cb);
    },

    removeInfo: function(id, cb){
        let conditions = {_id: id, authority:2};
        return this
            .remove(conditions, cb);
    },

    updateInfo: function(id, doc, cb){
        let conditions = {_id: id, authority:2};
        let options = {};
        let update = {$set: doc};
        return this
            .update(conditions, update, options, cb);
    },

    updateSuperInfo: function(id, doc, cb){
        let conditions = {_id: id, authority:3};
        let options = {};
        let update = {$set: doc};
        return this
            .update(conditions, update, options, cb);
    }
});


module.exports = mongoose.model('users', AdminSchema, 'users');