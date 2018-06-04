import Model from '../../models/index'
import Entity from '../../service/entity'
import Serrors from '../../utils/serror'
import _ from 'lodash'


// import domain from '../../../nconf/domain'


export default {
    /**
     * 获取状态码列表
     * @param  {Object} params 查询条件
     * return  {Promise}  res
     * */
    async getStateCodes(params = {}) {

        let res = null,
            doc

        doc = await Entity.fetch(Model.statecode, 'lastTime', params).catch(e => {
            res = Serrors.findError('状态码获得列表失败')
        })

        if (!res) {
            res = {
                code: 200,
                data: { details: doc },
                msg: '请求成功'
            }
        }

        return Promise.resolve(res)
    },
    /**
     * 删除状态码列表
     * @param  {ObjectId} id 状态码Id
     * return  {Promise}  res
     * */
    async delStateCode(id) {
        let res = null,
            doc = null;

        doc = await Entity.remove(Model.statecode, id).catch(e => {
            res = Serrors.delError('删除状态码失败')
        })

        if (!res) {
            res = {
                code: 200,
                data: doc,
                msg: '删除成功'
            }
        }

        return Promise.resolve(res)
    },
    /**
     * 更新状态码
     * @param  {Object} params 更新内容
     * return  {Promise}  res
     * */
    async updateAddStateCode(params = {}) {

        let res = null,
            doc = null

        if (_.has(params, 'id') && params.id) {
            if (String(params.id).length === 24) {
                let id = params.id,
                    opt = _.omit(params, ['id'])
                opt.lastTime = Date.now()
                doc = await Entity.update(Model.statecode, id, opt).catch(e => {
                    res = Serrors.delError('更新失败')
                })
            } else {
                res = Serrors.paramsError()
            }


        } else {
            let opt = _.omit(params, ['id'])
            opt.lastTime = Date.now()
            doc = await Entity.create(Model.statecode, opt).catch(e => {
                res = Serrors.delError('创建失败')
            })
        }

        if (!res && doc) {
            res = {
                code: 200,
                data: doc,
                msg: '请求成功'
            }
        }

        return Promise.resolve(res)
    }
};