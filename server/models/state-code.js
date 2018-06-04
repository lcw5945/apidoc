/**
 * Created by Cray on 2017/7/3.
 */
import baseModel from './base-model';
import _ from 'lodash';

var mongoose = require('mongoose');

const  StateCodeSchema =  new mongoose.Schema({
    projectId: String,
    scode: String,
    description: String,
    type: String,
    remark: String,
    json: Object,
    lastTime: String,
    groupId: String,
    paramList:Array
}, {versionKey:false});


StateCodeSchema.statics =  _.merge(baseModel,{
    /*fetch: function (conditions, cb) {
        return this
            .find(conditions)
            .sort({lastTime: 'desc'})
            .exec(cb);
    },
    removeByOpts: function(conditions, cb){
        return this
            .remove(conditions)
            .exec(cb);
    }*/
});

module.exports = mongoose.model('statecode', StateCodeSchema, 'statecodes');