/**
 * Created by Cray on 2017/8/1.
 */
import baseModel from './base-model';
import _ from 'lodash';

var mongoose = require('mongoose');

const GroupSchema =  new mongoose.Schema({
    projectId: String,
    databaseId: String,
    type:String,
    lastTime: String,
    name: String
}, {versionKey:false});


GroupSchema.statics = _.merge(baseModel,{
    fetch: function (conditions, cb) {
        return this
            .find(conditions)
            .sort({URI: 'desc'})
            .exec(cb);
    },
    updateInfo: function(id, doc, cb){
        let conditions = {_id: id};
        let options = {};
        let update = {$set: doc};
        return this
            .update(conditions, update, options, cb);
    },
    removeInfo: function(id, cb){
        let conditions = {_id: id};
        return this
            .remove(conditions, cb);
    },
    removeByOpts: function(conditions, cb){
        return this
            .remove(conditions)
            .exec(cb);
    }
});

module.exports = mongoose.model('group', GroupSchema, 'groups');