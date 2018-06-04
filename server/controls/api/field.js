/**
 * Created by chy on 2018/2/26.
 */
import Model from '../../models/index'
import Entity from '../../service/entity'
import Serrors from '../../utils/serror'
import Params from '../../utils/params'
import _ from 'lodash'


export default {
    /**
     * 获得字段
     * */
    async getFields(conditions = {}){
        let doc = null,
            res = null

        doc = await Entity.fetch(Model.filed, 'lastTime', conditions).catch(e => {
            res = Serrors.findError('字段列表获取失败')
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
     * 添加/修改字段
     * */
    async updateAddField(params){
        let doc = null,
            res = null

        if (params['id'] && Params.isObejctId(params.id)) {
            let paramsObj = _.omit(params, ['id'])
            paramsObj.lastTime = new Date().getTime()
            doc = await Entity.update(Model.filed, params.id, paramsObj).catch(e => {
                res = Serrors.updateError()
            })
        } else {
            doc = await Entity.create(Model.filed, params).catch(e => {
                res = Serrors.createError()
            })
        }

        if (!res) {
            res = {
                code: 200,
                data: doc,
                msg: '操作成功'
            }
        }

        return new Promise((resolve) => {
            resolve(res)
        })

    },

    /**
     * 删除字段
     **/
    async delField(id){
        let doc=null,
            res=null

        await Entity.findById(Model.filed, id).catch(e => {
            res = Serrors.findError()
        })

        if (!res) {
            doc = await Entity.remove(Model.filed, id).catch(e => {
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
    }
}