import _ from 'lodash'
import { wraper } from '../utils/wraper'

export default {

    /**
     * 抓取数据
     * @param {*} model
     */
    fetch(model, sortType = 'update_time', conditions = {}) {
        return new Promise((resolve, reject) => {
            model.fetch((err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            }, sortType, conditions)
        })
    },
    /**
     * 分页获取数据
     */
    fetchPage(model, skip, limit, sortType, conditions) {
        return new Promise((resolve, reject) => {
            model.fetchPage(parseInt(skip), parseInt(limit), (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            }, sortType, conditions)
        })
    },

    /**
     * 分页获取数据 关联查询
     */
    refFetchPage(model, skip, limit, sortType, conditions) {
        return new Promise((resolve, reject) => {
            model.refFetchPage(parseInt(skip), parseInt(limit), (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            }, sortType, conditions)
        })
    },

    /**
     * 分页获取数据 关联查询
     */
    refFetch(model, sortType, conditions) {
        return new Promise((resolve, reject) => {
            model.refFetch((err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            }, sortType, conditions)
        })
    },

    /**
     * 查找多个
     * @param {*} model
     * @param {*} conditions
     */
    find(model, conditions) {
        return new Promise((resolve, reject) => {
            model.findInfo(conditions, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },

    /**
     * 查找1个
     * @param {*} model
     * @param {*} conditions
     */
    findOne(model, conditions) {
        return new Promise((resolve, reject) => {
            model.findOneInfo(conditions, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },

    /**
     * 查找一个
     * @param {*} model
     * @param {*} id
     */
    findById(model, id) {
        return new Promise((resolve, reject) => {
            model.findById(id, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    /**
     * 查找一个 关联查询
     * @param {*} model
     * @param {*} id
     */
    refFindById(model, id) {
        return new Promise((resolve, reject) => {
            model.refFindById(id, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })

    },

    /**
     * 查询多个id数据
     * @param {*} model
     * @param {*} ids
     */
    findByMulId(model, ids) {
        return new Promise((resolve, reject) => {
            model.findByMulId(ids, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },

    /**
     * 数量查询
     * @param {*} model
     * @param {*} conditions
     */
    count(model, conditions) {
        return new Promise((resolve, reject) => {
            model.counts(conditions, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },

    /**
     * 创建文档
     * @param {*} model
     * @param {*} doc
     */
    create(model, doc) {
        //封装参数
        doc = wraper(model, doc)
        return new Promise((resolve, reject) => {
            model.createInfo(doc, (err, data) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            })
        })
    },

    /**
     * 更新
     * @param {*} model
     * @param {*} id
     * @param {*} params
     */
    update(model, id, params) {
        return new Promise((resolve, reject) => {
            model.updateInfo(id, params, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    /**
     * 更新
     * @param {*} model
     * @param {*} params
     */
    updateBase(model, conditions = {}, update = {}, options = {}) {
        return new Promise((resolve, reject) => {
            model.update(conditions, update, options, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },


    /**
     * 删除by id
     * @param {*} model
     * @param {*} id
     */
    remove(model, id) {
        return new Promise((resolve, reject) => {
            model.removeInfo(id, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    /**
     * 删除
     * @param {*} model
     * @param {*} condition 删除的条件
     */
    removeBase(model, condition) {
        return new Promise((resolve, reject) => {
            model.remove(condition, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },


    /**
     * 聚合函数
     * @param {*} model
     * @param {Array} conditions 查询条件
     */
    aggregate(model, conditions) {
        return new Promise((resolve, reject) => {
            model.aggregate(conditions, (err, doc) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    }

}