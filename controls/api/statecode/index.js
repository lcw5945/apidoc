/**
 * Created by Cray on 2017/7/3.
 */

import Operate from '../operate';
import Params from '../params';
import * as Model from '../../../models';

export default {
    /**
     * 获得列表
     * @param req
     * @param res
     */
    getStateCodes(req, res) {
        let conditions = Params.queryValidate(req, res);
        if(conditions.groupId === -1){
            delete conditions.groupId;
        }
        console.log(conditions)
        Operate.queryInfo(Model.statecode, req, res, conditions);
    },

    /**
     * 删除
     * @param req
     * @param res
     */
    delStateCode(req, res) {
        Operate.removeByInfo(Model.statecode, req, res);
    },

    /**
     * 创建更新
     * @param req
     * @param res
     */
    updateAddStateCode(req, res) {
        let params = Params.bodyValidate(req, res);
        Operate.updateAdd(Model.statecode, req, res, params);
    }
};