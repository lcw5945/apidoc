/**
 * Created by Cray on 2017/7/3.
 */
import baseModel from './base-model';
import _ from 'lodash';

var mongoose = require('mongoose');

const  DatabaseSchema =  new mongoose.Schema({
    name: String,
    version: String,
    lastTime: String,
    admin: String,
}, {versionKey:false});


DatabaseSchema.statics =  _.merge(baseModel,{
    fetch: function (cb) {
        let conditions = {};
        return this
            .find(conditions)
            .sort({name: 'desc'})
            .exec(cb);
    }
});

module.exports = mongoose.model('databases', DatabaseSchema, 'databases');