import Params from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import StatecodeCtrl from '../../../controls/api/statecode'
export default {
    route(router) {
        /**
         * 获取状态码列表
         */
        router.get('/getStateCodes', async(req, res) => {
            let params = Params.queryValidate(req, res) || {};
            let resJson = await StatecodeCtrl.getStateCodes({projectId: params.projectId})
            res.json(resJson)
        });
        /**
         * 删除状态码
         */
        router.post('/delStateCode', async(req, res) => {
            let params = Params.bodyValidate(req, res) || {},
                resJson;
            if (_.isPlainObject(params) && Params.isObejctId(params.id)) {
                resJson = await StatecodeCtrl.delStateCode(params.id)
            } else {
                resJson = Serrors.paramsError()
            }

            res.json(resJson)
        });
        /**
         * 更新/添加状态码
         */
        router.post('/updateAddStateCode', async(req, res) => {
            let params = Params.bodyValidate(req, res) || {};
            let resJson = await StatecodeCtrl.updateAddStateCode(params)
            res.json(resJson)
        });
    }
};