import Model from '../models/index'
import Entity from '../service/entity'
import Serrors from '../utils/serror'
import _ from 'lodash'

export default {
    async start () {
        console.log('start format interface')
        let res = null
        let doc = await Entity.fetch(Model.interfaces, 'update').catch(e => {
            res = {
                code: 500,
                data: null,
                msg: 'query interfaces list error'
            }
        })

        let _data = doc

        _.forEach(_data, async(interItem, key) => {
            let uData = Object.assign({}, interItem._doc);
            delete uData._id;
            console.log(interItem._id, '-->tag：', uData.tag, ' mockResult：', uData.apiJson && uData.apiJson.mockResult, ' creator：', uData.creator)
            if (!_.hasIn(uData, 'tag') || !_.hasIn(uData, 'apiJson.mockResult') || !_.hasIn(uData, 'creator')) {
                if (!_.hasIn(uData, 'tag')) {
                    uData.tag = "";
                }
                if (!_.hasIn(uData, 'apiJson.mockResult')) {
                    if (!uData.apiJson) {
                        uData.apiJson = {
                            mockResult: {},
                            successResult: {},
                            errorResult: {}
                        }
                    } else {
                        uData.apiJson.mockResult = uData.apiJson.successResult;
                    }

                }
                if (!_.hasIn(uData, 'creator')) {
                    uData.creator = "";
                }

                await Entity.update(Model.interfaces, interItem._id, uData).catch((e) => {
                    res = {
                        code: 500,
                        data: null,
                        msg: '接口id为' + interItem._id + "，修改失败"
                    }
                })
                console.log('完成后', interItem._id, '-->tag：', uData.tag, ' mockResult：', uData.apiJson.mockResult, ' creator：', uData.creator)
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