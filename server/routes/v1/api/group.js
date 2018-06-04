import Params from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import GroupCtrl from '../../../controls/api/group'
export default {
    route(router) {
        /**
         * 获取分组列表
         */
        router.get('/getGroups', async(req, res) => {
            let params = Params.queryValidate(req, res) || {};
            params = _.pick(params, ['projectId', 'databaseId']);
            if(!params["projectId"]){
                delete params["projectId"]
            }
            if(!params["databaseId"]){
                delete params["databaseId"]
            }
            let resJson = await GroupCtrl.getGroups(params)
            res.json(resJson)
        });
        /**
         * 删除分组
         */
        router.post('/delGroup', async(req, res) => {
            let params = Params.bodyValidate(req, res) || {},
                resJson;
            if (_.isPlainObject(params) && Params.isObejctId(params.id)) {
                resJson = await GroupCtrl.delGroup(params)
            } else {
                resJson = Serrors.paramsError()
            }

            res.json(resJson)
        });
        /**
         * 更新/添加分组
         */
        router.post('/updateAddGroup', async(req, res) => {
            let params = Params.bodyValidate(req, res) || {};
            let resJson = await GroupCtrl.updateAddGroup(params)
            res.json(resJson)
        });
    }
};