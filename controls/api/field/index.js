/**
 * Created by Cray on 2017/7/28.
 */

import Operate from '../operate';
import Params from '../params';
import * as Model from '../../../models';
import Serror from '../serror';
export default {
    /**
     * 获得列表
     * @param req
     * @param res
     */
    getFields(req, res) {
        let conditions = Params.queryValidate(req, res);
        if(conditions.groupId === -1){
            delete conditions.groupId;
        }
        Operate.queryInfo(Model.filed, req, res, conditions);
    },

    /**
     * 删除
     * @param req
     * @param res
     */
    delField(req, res) {
        Operate.removeByInfo(Model.filed, req, res);
    },

    /**
     * 创建更新
     * @param req
     * @param res
     */
    updateAddField(req, res) {
        let params = Params.bodyValidate(req, res);
        Operate.updateAdd(Model.filed, req, res, params);
    }
};