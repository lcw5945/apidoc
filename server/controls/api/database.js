import Model from '../../models/index'
import Entity from '../../service/entity'
import Serrors from '../../utils/serror'
import _ from 'lodash'


// import domain from '../../../nconf/domain'


export default {
    /**
     * 获得列表
     * @param req
     * @param res
     */
    async getDatabases() {

        let res = null, doc

        doc = await Entity.fetch(Model.database, "lastTime").catch(e => {
            res = Serrors.findError('数据字典获得列表失败')
        })

        if (!res) {
            res = {
                code: 200,
                data: {
                    details: doc
                },
                msg: '请求成功'
            }
        }

        return new Promise((resolve) => {
            resolve(res)
        })

    },

    /**
     * 删除
     * @param req
     * @param res
     */
    async delDatabase(params) {
        let res = null, doc

        await Entity.findOne(Model.database, params).catch(e => {
            res = Serrors.findError('数据字典查找失败')
        })

        if (!res) {
            doc = await Entity.remove(Model.database, params).catch(e => {
                res = Serrors.findError('数据字典删除失败')
            })
            if (!res && doc) {
                res = {
                    code: 200,
                    data: doc,
                    msg: '删除成功'
                }
            }
        }

        return new Promise((resolve) => {
            resolve(res)
        })
    },

    /**
     * 创建更新
     * @param req
     * @param res
     */
    async updateAddDatabase(params) {
        let res = null,
            doc = null,
            userData = null,
            {name, id} = params

        userData = await Entity.find(Model.database, {name}).catch(e => {
            res = Serrors.findError('数据字典查找失败')
        })

        if (userData && (userData.length === 0 || String(userData[0]._id) === String(id))) {
            if (params.id) {
                if (String(params.id).length === 24) {
                    let id = params.id,
                        opt = _.omit(params, ['id'])
                    opt.lastTime = Date.now()
                    doc = await Entity.update(Model.database, id, opt).catch(e => {
                        res = Serrors.delError('更新失败')
                    })
                } else {
                    res = Serrors.paramsError()
                }
            } else {
                doc = await Entity.create(Model.database, params).catch(e => {
                    res = Serrors.delError('创建失败')
                })
            }
        } else {
            res = Serrors.operateError('数据库名称已存在')
        }


        if (!res && doc) {
            res = {
                code: 200,
                data: doc,
                msg: '请求成功'
            }
        }

        return new Promise((resolve) => {
            resolve(res)
        })
    }
};