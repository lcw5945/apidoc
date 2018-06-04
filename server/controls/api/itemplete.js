import Model from '../../models/index'
import Entity from '../../service/entity'
import Serrors from '../../utils/serror'
import _ from 'lodash'

export default {
    /**
     * 获得接口列表
     * @param params
     * @returns {Promise<any>}
     */
    async getITempletes(projectId) {
        let res = null, doc
        doc = await Entity.fetch(Model.itemplete, "lastTime", {projectId}).catch(e => {
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
     * @param id
     * @returns {Promise<any>}
     */
    async delITemplete(id) {
        let res = null, doc

        await Entity.findOne(Model.itemplete, { _id: id }).catch(e => {
            res = Serrors.findError('模板查找失败')
        })

        if (!res) {
            doc = await Entity.remove(Model.itemplete, { _id: id }).catch(e => {
                res = Serrors.delError()
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

    // 修改 新增
    async updateAddITemplete(params) {
        let res = null,
            id = params.id, // 模板id
            doc = null;

        if (id != undefined && id != '') { // 修改
            // 直接保存所有修改
            let opt = _.omit(params, ['id'])
            opt.lastTime = Date.now()
            doc = await Entity.update(Model.itemplete, id, opt).catch(e => {
                res = Serrors.updateError('修改保存错误')
            })

        } else {  // 新增
            console.log("新增");
            doc = await Entity.create(Model.itemplete, params).catch(e => {
                res = Serrors.createError('创建失败')
            })
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
}