import Params from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import DatabaseCtrl from '../../../controls/api/database'

export default {
    route(router) {
        router.get('/getDatabases', async (req, res) => {
            let resJson = await DatabaseCtrl.getDatabases()
            res.json(resJson)
        })

        router.post('/delDatabase', async (req, res) => {
            let params = Params.bodyValidate(req, res),
                resJson
            if(_.isPlainObject(params) && Params.isObejctId(params.id)){
                resJson = await DatabaseCtrl.delDatabase({_id: params.id})
            }else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

        router.post('/updateAddDatabase', async (req, res) => {
            let params = Params.bodyValidate(req, res) || {},
                resJson
            if (_.isPlainObject(params)) {
                delete params.token;
                resJson = await DatabaseCtrl.updateAddDatabase(params)
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })
    }
};