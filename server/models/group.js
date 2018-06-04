/**
 * Created by Cray on 2017/8/1.
 */
import baseModel from './base-model';
import _ from 'lodash';

var mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    projectId: String,
    databaseId: String,
    type: String,
    lastTime: String,
    name: String
}, { versionKey: false });


GroupSchema.statics = _.merge(baseModel, {});
module.exports = mongoose.model('group', GroupSchema, 'groups');