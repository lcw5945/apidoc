/**
 * Created by chy on 2018/2/26.
 */
import Params from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import FieldCtrl from '../../../controls/api/field'

export default {
    route(router) {
        router.get('/getFields', async (req, res) => {
            let params = Params.queryValidate(req, res) || {},
                resJson = null

            if (params.groupId === -1) {
                delete params.groupId;
            }

            if (_.isPlainObject(params) && params.databaseId) {
                resJson = await FieldCtrl.getFields({databaseId: params.databaseId})
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

        router.post('/updateAddField', async (req, res) => {
            let params = Params.bodyValidate(req, res) || {},
                resJson = null
            if (_.isPlainObject(params)) {
                resJson = await FieldCtrl.updateAddField(params)
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

        router.post('/delField', async (req, res) => {
            let params = Params.bodyValidate(req, res) || {},
                resJson = null
            if (_.isPlainObject(params)) {
                resJson = await FieldCtrl.delField(params.id)
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })
    }
};