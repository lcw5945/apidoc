
import Model from '../../models/index'
import Entity from '../../service/entity'
import Serrors from '../../utils/serror'
import _ from 'lodash'


// import domain from '../../../nconf/domain'


export default {

    /**
     * 获得接口列表
     * @param req
     * @param res
     */
    async getInterfaces(params) {
        let res = null, doc
        doc = await Entity.fetch(Model.interfaces, "update", params).catch(e => {
            res = Serrors.findError('接口列表获得失败')
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
     * 删除接口
     * @param req
     * @param res
     */
    async delInterfaces(params) {

        let res = null, doc

        let idoc = await Entity.findOne(Model.interfaces, params).catch(e => {
            res = Serrors.findError('接口查找失败')
        })

        if (!res) {
            doc = await Entity.remove(Model.interfaces, idoc._id).catch(e => {
                res = Serrors.findError('接口删除失败')
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
     * 创建更新接口
     * @param req
     * @param res
     */
    async updateAddInterfaces(params) {
        let res = null,
            doc = null,
            apiData = null,
            {URI, id, projectId} = params


        // apiData = await Entity.find(Model.interfaces, {URI}).catch(e => {
        //     res = Serrors.findError('接口查找失败')
        // })

        // apiData = apiData.find((item, index) => String(item.projectId) === String(projectId))

        // if (apiData && (String(apiData._id) !== String(id))) {
        if (false) {
            res = Serrors.operateError('接口已存在')
        } else {
            if (params.id) {
                if (String(params.id).length === 24) {
                    let id = params.id,
                        opt = _.omit(params, ['id'])
                    opt.update = Date.now()
                    doc = await Entity.update(Model.interfaces, id, opt).catch(e => {
                        res = Serrors.delError('更新失败')
                    })
                } else {
                    res = Serrors.paramsError()
                }
            } else {
                doc = await Entity.create(Model.interfaces, params).catch(e => {
                    res = Serrors.delError('创建失败')
                })
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
    }

};