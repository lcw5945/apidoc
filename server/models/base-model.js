/**
 * Created by Cray on 2017/3/23.
 */

export default {
    fetch: function(cb, sortType = 'update_time', conditions = {}) {
        return this
            .find(conditions)
            .sort({ [sortType] : 'desc' })
            .exec(cb);
    },
    fetchPage: function(skip, limit, cb, sortType = 'update_time', conditions = {}) {
        return this
            .find(conditions)
            .skip(skip)
            .limit(limit)
            .sort({ [sortType] : 'desc' })
            .exec(cb);
    },
    findById: function(id, cb){
        return this
            .findOne({_id: id})
            .exec(cb);
    },
    counts: function (conditions, cb) {
        return this
            .count(conditions)
            .exec(cb);
    },
    findByMulId(ids, cb) {
        return this
        .find({ _id: {'$in': ids} })
        .exec(cb);
    },
    findOneInfo: function(conditions, cb){
        return this
            .findOne(conditions)
            .exec(cb);
    },
    findInfo: function(conditions, cb){
        return this
            .find(conditions)
            .exec(cb);
    },
    createInfo: function(doc, cb){
        return this
            .create(doc, cb);
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
    }
}