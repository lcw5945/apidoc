/**
 * Created by chy on 2018/2/27.
 */
import ParamsUtils from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import TestEnvCtrl from '../../../controls/api/testenv'

export default {
    route(router) {
        router.get('/getTestEnvs', async(req, res) => {
            let {projectid} = ParamsUtils.queryValidate(req),
                resJson = null

            if (ParamsUtils.isObejctId(projectid)) {
                resJson = await TestEnvCtrl.getTestEnvs(projectid)
            } else {
                resJson = Serrors.paramsError()
            }

            res.json(resJson)
        })

        router.post('/updateAddTestEnv', async(req, res) => {
            let params = ParamsUtils.bodyValidate(req, res) || {},
                resJson = null

            let {name, URI, projectid} = params

            if (_.isPlainObject(params) && name && URI && ParamsUtils.isObejctId(projectid)) {
                resJson = await TestEnvCtrl.updateAddTestEnv(params)
            } else {
                resJson = Serrors.paramsError()
            }

            res.json(resJson)
        })

        router.post('/delTestEnv', async(req, res) => {
            let params = ParamsUtils.bodyValidate(req, res) || {},
                resJson = null

            if (_.isPlainObject(params) && params.id && ParamsUtils.isObejctId(params.id)) {
                resJson = await TestEnvCtrl.delTestEnv(params.id)
            } else {
                resJson = Serrors.paramsError()
            }

            res.json(resJson)
        })
    }
};