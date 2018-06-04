/**
 * Created by Cray on 2017/7/3.
 */
import _ from 'lodash'
import Serrors from '../../../utils/serror'
import domain from '../../../conf/domain'
import Utils from '../../../utils'
import Model from '../../../models'
import Entity from '../../../service/entity'

export default {

    /**
     * 获取管理员
     **/
    async getAdmins () {
        let res = null, doc
        doc = await Entity.fetch(Model.admin, "regTime").catch(e => {
            res = Serrors.findError('管理员列表获得失败')
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
     * 删除管理员
     **/
    async delAdmin(params) {

        let res = null, doc

        await Entity.findOne(Model.admin, params).catch(e => {
            res = Serrors.findError('管理员查找失败')
        })

        if (!res) {
            doc = await Entity.remove(Model.admin, params).catch(e => {
                res = Serrors.findError('管理员删除失败')
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
     * 编辑普通管理员
     **/
    async updateAddAdmin(params) {
        let res = null,
            doc = null,
            password = Utils.md5(params.password),
            regTime = Date.now(),
            {username} = params,
            opt = null

        if (params.id) {
            if (String(params.id).length === 24) {
                let id = params.id
                opt = _.omit(params, ['id'])
                opt = {
                    ...opt,
                    password,
                    regTime
                }
                doc = await Entity.update(Model.admin, id, opt).catch(e => {
                    res = Serrors.delError('更新失败')
                })
            } else {
                res = Serrors.paramsError()
            }
        } else {
            let userData = await Entity.find(Model.admin, {username}).catch((e) => {
                res = Serrors.findError()
            })
            if (userData && !userData.length) {
                opt = {
                    ...params,
                    password,
                    regTime
                }
                doc = await Entity.create(Model.admin, opt).catch(e => {
                    res = Serrors.delError('创建失败')
                })

                if (doc.password) delete doc.password
            }else {
                res = Serrors.operateError('用户已存在')
            }
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
    },

    /**
     * 编辑超级管理员
     **/
    async updateSuperAdmin(params) {
        let res = null,
            doc = null,
            password = Utils.md5(params.password),
            regTime = Date.now(),
            {authority} = params,
            _id = params.id,
            opt = null,
            userData = null

        userData = await Entity.findOne(Model.admin, {_id}).catch(e => {
            res = Serrors.findError('管理员查找失败')
        })

            if (userData.authority = authority) {
                let id = params.id
                opt = _.omit(params, ['id'])
                opt = {
                    ...opt,
                    password,
                    regTime
                }
                doc = await Entity.update(Model.admin, id, opt).catch(e => {
                    res = Serrors.delError('更新失败')
                })
            } else {
                res = Serrors.paramsError()
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
    },
}