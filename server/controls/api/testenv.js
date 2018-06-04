/**
 * Created by chy on 2018/2/27.
 */
import Model from '../../models/index'
import Entity from '../../service/entity'
import Serrors from '../../utils/serror'
import Params from '../../utils/params'
import _ from 'lodash'


export default {
    /**
     * 获得测试环境
     * */
    async getTestEnvs(projectid){
        let doc = null,
            res = null

        doc = await Entity.find(Model.testenv, {projectid}).catch(e => {
            res = Serrors.findError('测试环境获取失败')
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
     * 添加/修改测试环境
     * */
    async updateAddTestEnv(params){
        let doc = null,
            res = null

        if (params['id'] && Params.isObejctId(params.id)) {
            let paramsObj = _.omit(params, ['id'])
            doc = await Entity.update(Model.testenv, params.id, paramsObj).catch(e => {
                res = Serrors.updateError()
            })
        } else {
            doc = await Entity.create(Model.testenv, params).catch(e => {
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
     * 删除测试环境
     **/
    async delTestEnv(id){
        let doc=null,
            res=null

        await Entity.findById(Model.testenv, id).catch(e => {
            res = Serrors.findError()
        })

        if (!res) {
            doc = await Entity.remove(Model.testenv, id).catch(e => {
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