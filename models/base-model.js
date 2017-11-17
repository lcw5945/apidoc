/**
 * Created by Cray on 2017/3/23.
 */

export default {
    fetch: function (cb) {
        return this
            .find({})
            .sort({'index': 'asc'})
            .exec(cb);
    },
    findById: function(id, cb){
        return this
            .findOne({_id: id}).exec(cb);
    },
    findByMulId(ids, cb) {
        return this.find({ _id: {'$in': ids} }), exec(cb);
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