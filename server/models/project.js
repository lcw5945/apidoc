/**
 * Created by Cray on 2017/7/3.
 */
import baseModel from './base-model';
import _ from 'lodash';
var mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: String,
    version: String,
    type: String,
    lastTime: String,
    admin: String,
    cooperGroup: Array,
    adminInfo: Object,
    loginInfo: Object
}, { versionKey: false });


ProjectSchema.statics = _.merge(baseModel, {
    /*fetch: function(cb) {
        let conditions = {};
        return this
            .find(conditions)
            .sort({ lastTime: 'desc' })
            .exec(cb);
    },
    findByName(name, cb) {
        return this
            .findOne({ name: name })
            .exec(cb);
    },
    createInfo: function(doc, cb) {
        return this
            .create(doc, cb);
    },*/
});

module.exports = mongoose.model('project', ProjectSchema, 'projects');