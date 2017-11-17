/**
 * Created by Cray on 2017/7/3.
 */
import baseModel from './base-model';
import _ from 'lodash';
var mongoose = require('mongoose');

const  TestEnvSchema =  new mongoose.Schema({
    name: String,
    URI: String,
    lastTime: String
}, {versionKey:false});


TestEnvSchema.statics =  _.merge(baseModel,{
    fetch: function (cb) {
        let conditions = {};
        return this
            .find(conditions)
            .sort({name: 'desc'})
            .exec(cb);
    }
});

module.exports = mongoose.model('testenv', TestEnvSchema, 'testenvs');