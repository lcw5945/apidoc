import Model from '../../models/index'
import Entity from '../../service/entity'
import Serrors from '../../utils/serror'
import _ from 'lodash'


// import domain from '../../../nconf/domain'


export default {
    /**
     * 获取分组列表
     * @param  {Object} params 查询条件
     * return  {Promise}  res
     * */
    async getGroups(params = {}) {

        let res = null,
            doc

        doc = await Entity.fetch(Model.group, 'lastTime', params).catch(e => {
            res = Serrors.findError('组获得列表失败')
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
     * 删除分组列表
     * @param  {ObjectId} id 分组Id
     * return  {Promise}  res
     * */
    async delGroup(params = {}) {
        let res = null,
            doc = null,
            opt = { groupId: params.id };
        if (params["projectId"]) {
            await Entity.updateBase(Model.interfaces, opt, { groupId: -2 }).catch(e => {
                res = Serrors.delError('更新接口组失败')
            });
        } else if (params["databaseId"]) {
            await Entity.updateBase(Model.filed, opt, { groupId: -2 }).catch(e => {
                res = Serrors.delError('更新database组失败')
            });
        }
        if (!res) {
            doc = await Entity.remove(Model.group, params.id).catch(e => {
                res = Serrors.delError('删除组失败')
            })
        }


        if (!res && doc) {
            res = {
                code: 200,
                data: doc,
                msg: '删除成功'
            }
        }

        return Promise.resolve(res)
    },
    /**
     * 更新分组
     * @param  {Object} params 更新内容
     * return  {Promise}  res
     * */
    async updateAddGroup(params = {}) {

        let res = null,
            doc = null

        if (_.has(params, 'id') && params.id) {
            if (String(params.id).length === 24) {
                let id = params.id,
                    opt = _.omit(params, ['id'])
                opt.lastTime = Date.now()
                doc = await Entity.update(Model.group, id, opt).catch(e => {
                    res = Serrors.delError('更新失败')
                })
            } else {
                res = Serrors.paramsError()
            }

        } else {
            let opt = _.omit(params, ['id'])
            opt.lastTime = Date.now()
            doc = await Entity.create(Model.group, opt).catch(e => {
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