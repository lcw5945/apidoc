/**
 * Created by VULCAN on 2018/2/26.
 */
import Params from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import InterfacesCtrl from '../../../controls/api/inerface'
import domain from '../../../conf/domain'

export default {
    route(router) {
        router.get('/getInterfaces', async (req, res) => {
            let params = Params.queryValidate(req, res) || {},
                resJson
            if (_.isPlainObject(params) && params.projectId) {
                resJson = await InterfacesCtrl.getInterfaces({projectId: params.projectId})
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

        router.post('/delInterfaces', async (req, res) => {
            let params = Params.bodyValidate(req, res) || {},
                resJson
            if (_.isPlainObject(params) && Params.isObejctId(params.id)) {
                resJson = await InterfacesCtrl.delInterfaces({_id: params.id})
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

        router.post('/updateAddInterfaces', async (req, res) => {
            let params = Params.bodyValidate(req, res) || {},
                resJson
            if (_.isPlainObject(params)) {
                delete params.token
                console.log('domain', domain)
                params.creator = domain.username
                console.log('params', params)
                resJson = await InterfacesCtrl.updateAddInterfaces(params)
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

    }
}