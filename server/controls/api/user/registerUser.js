/**
 * Created by Cray on 2017/7/3.
 */
import _ from 'lodash'
import Serrors from '../../../utils/serror'
import domain from '../../../conf/domain'
import constant from '../../../conf/constant'
import Utils from '../../../utils'
import Model from '../../../models'
import Entity from '../../../service/entity'

const {defautlPwd} = constant

export default {
    /**
     * 注册
     * @param {String} username  用户名称
     * @param {String} password  用户密码
     */
    async register(params) {
        let res,
            doc,
            userData,
            password = Utils.md5(params.password),
            regTime = Date.now(),
            {username} = params

        userData = await Entity.find(Model.user, {username}).catch((e) => {
            res = Serrors.findError()
        })

        if (userData && !userData.length) {
            params = {
                ...params,
                authority: parseInt(params['authority']) && parseInt(params['authority']) === 2 && domain.authority === 3 ? 2 : 0,
                password,
                regTime
            }
            doc = await Entity.create(Model.user, params).catch((e) => {
                res = Serrors.createError()
            })
            if (doc.password) delete doc.password
        } else {
            res = Serrors.operateError('用户已存在')
        }

        if (!res) {
            res = {
                code: 200,
                data: doc,
                msg: '注册成功'
            }
        }
        return new Promise((resolve) => {
            resolve(res)
        })
    },

    /**
     * 获得注册用户列表
     */
    async getRegistUsers(params) {
        let res, doc
        params.authority = {$lte: 2}
        if (params.hasOwnProperty('token')) delete params.token
        doc = await Entity.find(Model.user, params).catch((e) => {
            res = Serrors.createError()
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
     * 重置用户密码
     * @param {String} id  用户id
     */
    async resetRegistUser(id) {
        let res,
            password = Utils.md5(defautlPwd)

        await Entity.update(Model.user, id, {password}).catch((e) => {
            res = Serrors.updateError()
        })

        if (!res) {
            res = {
                code: 200,
                data: {
                    password: defautlPwd
                },
                msg: '更新成功'
            }
        }

        return new Promise((resolve) => {
            resolve(res)
        })
    },

    /**
     * 按条件搜索用户
     * @param {String} username  用户名
     */
    async searchRegistUsers(username) {
        let res,
            doc,
            reg = new RegExp(username);

        doc = await Entity.find(Model.user, {username: reg}).catch((e) => {
            res = Serrors.findError()
        })

        if (!res) {
            res = {
                code: 200,
                data: doc,
                msg: '查询成功'
            }
        }

        return new Promise((resolve) => {
            resolve(res)
        })
    },

    /**
     * 更新用户
     * @param {String} username  用户名
     */
    async updateUser(params) {
        let res,
            userData,
            id = domain.userId,
            oldpassword = Utils.md5(params['oldpassword']),
            password = Utils.md5(params['password'])
        userData = await Entity.findById(Model.user, id).catch((e) => {
            res = Serrors.findError()
        })
        if (userData) {
            if (oldpassword != userData['password']) {
                res = Serrors.operateError('旧密码错误')
            } else {
                await Entity.update(Model.user,id, {password}).catch((e) => {
                    res = Serrors.updateError()
                })
            }
        }

        if (!res) {
            res = {
                code: 200,
                data: {},
                msg: '更新成功'
            }
        }
        console.log('---------res', res);
        return new Promise((resolve) => {
            resolve(res)
        })
    },

    /**
     * 更新用户
     * @param {String} username  用户名
     */
    async getMulUser(ids) {
        let res,
            doc
        ids = ids.split(',')

        doc = await Entity.findById(Model.user, { _id: {'$in': ids} }).catch((e) => {
            res = Serrors.findError()
        })


        if (!res) {
            res = {
                code: 200,
                data: doc,
                msg: '更新成功'
            }
        }
        return new Promise((resolve) => {
            resolve(res)
        })
    },

    /**
     * 删除用户
     * @param {String} username  用户名
     */
    async delRegistUser(userid){
        let doc = null,
            res = null;

        doc = await Entity.remove(Model.user, userid).catch(e => {
            res = Serrors.findError('user删除失败')
        })
        if (!res) {
            res = {
                code: 200,
                data: doc,
                msg: '删除成功'
            }
        }

        return new Promise((resolve) => {
            resolve(res)
        })

    }

};



