/**
 * Created by Cray on 2017/7/3.
 */

import baseModel from './base-model';
import _ from 'lodash';

var mongoose = require('mongoose');

const InterfaceSchema = new mongoose.Schema({
    projectId: String,
    groupId: String,
    host: String,
    enable: Number,
    /*
     * enable ：0 弃用 1 启用 2 维护
     * */
    active: Number,
    /*
     * active ：0 未激活 1 激活
     * */
    proxyHost: String,
    dataType: String,
    URI: String,
    featureName: String,
    params: Array,
    /*
     require: 0不必填，1必填
     key: 参数名称
     des: 参数说明
     value: 值可能性<Array> valueCont:值可能性,valueDes:说明,valueDefault:0非默认值，1默认值
     subParams：参数<Array> 内部结构等同params
     * */
    returnData: Array,
    /*
     include: 0不必填，1必填
     returnDataKey: 返回名称
     returnDataDes: 返回说明
     value: 值可能性<Array> valueCont:值可能性,valueDes:说明
     * */
    remark: String,
    apiJson: Object,
    /*
     * successResult 成功结果
     * errorResult 失败结果
     * */
    /**
     * AJAX访问的历史记录
     **/
    history: Array,
    update: Number
}, {versionKey: false});


InterfaceSchema.statics = _.merge(baseModel, {
    fetch: function (conditions, cb) {
        return this
            .find(conditions)
            .sort({update: 'desc'})
            .exec(cb);
    },
    updateByOpts: function (conditions, doc, cb) {
        let options = {};
        let update = {$set: doc};
        return this
            .update(conditions, update, options, cb);
    },
    removeByOpts: function (conditions, cb) {
        return this
            .remove(conditions)
            .exec(cb);
    }
});

module.exports = mongoose.model('interface', InterfaceSchema, 'interfaces');

