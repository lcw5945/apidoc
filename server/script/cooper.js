/**
 * Created by Cray on 2017/7/3.
 */
import _ from 'lodash'
import * as Model from '../../../models'
import Entity from '../../../service/entity'
export default {
    async start () {
        console.log('start format cooper')
        let res = null
        let doc = await Entity.fetch(Model.project, 'lastTime').catch(e => {
            res = {
                code: 500,
                data: null,
                msg: 'query project list error'
            }
        })

        _.forEach(doc, async (pjItem, key) => {
            let params = {}
            params.id = pjItem._id
            params.lastTime = Date.now()
            params.cooperGroup = [];

            let ids = []
            _.forEach(pjItem.cooperGroup, (id, key) => {
                if (_.isString(id) || !id["username"]) {
                    let newID = _.isString(id) ? id : id.userId
                    ids.push(newID)
                    params.cooperGroup.push({
                        userId: newID,
                        username: "",
                        authority: 2
                    })
                }
            })
            console.log("params.cooperGroup", pjItem.cooperGroup)
            if (params.cooperGroup.length > 0) {
                console.log("ids", ids)

                let userDoc = await Entity.findByMulId(Model.user, ids).catch(e => {
                    res = {
                        code: 500,
                        data: null,
                        msg: 'query user list error'
                    }
                })
                console.log("userDoc", userDoc)
                // Operate.updateAdd(Model.project, req, res, params)
                let newCoopers = []
                _.forEach(params.cooperGroup, (obj, key) => {
                    _.forEach(userDoc, (user, ukey) => {
                        if (obj.userId == user._id) {
                            obj.username = user.username
                            newCoopers.push(obj)
                        }
                    })
                })
                let id = params.id;
                delete params.id;
                params.cooperGroup = newCoopers
                console.log("params", params)

                await Entity.updateInfo(Model.project, id, params).catch(e => {
                    res = {
                        code: 500,
                        data: null,
                        msg: 'update project list error'
                    }
                });

            }
        })

        // 解析数据
        if (!res) {
            res = {
                code: 200,
                data: '',
                msg: ''
            }
        }

        //返回数据
        return new Promise((resolve) => {
            resolve(res)
        })
    }
}