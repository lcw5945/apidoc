/**
 * Created by Cray on 2017/7/3.
 */

import baseModel from './base-model';
import _ from 'lodash';

var mongoose = require('mongoose');

const FieldSchema =  new mongoose.Schema({
    databaseId: String,
    name: String,
    type: String,
    length: Number,
    required : Number,
    primary : Number,
    groupId: String,
    lastTime: String,
    description: String
}, {versionKey:false});


FieldSchema.statics = _.merge(baseModel,{
    fetch: function (conditions, cb) {
        return this
            .find(conditions)
            .sort({URI: 'desc'})
            .exec(cb);
    },
    removeByOpts: function(conditions, cb){
        return this
            .remove(conditions)
            .exec(cb);
    }
});

module.exports = mongoose.model('field', FieldSchema, 'fields');