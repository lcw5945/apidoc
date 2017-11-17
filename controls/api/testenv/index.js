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
    getTestEnvs(req, res) {
        Operate.queryInfoAll(Model.testenv, req, res);
    },

    /**
     * 删除
     * @param req
     * @param res
     */
    delTestEnv(req, res) {
        Operate.removeByInfo(Model.testenv, req, res);
    },

    /**
     * 创建更新
     * @param req
     * @param res
     */
    updateAddTestEnv(req, res) {
        let params = Params.bodyValidate(req, res);
        Operate.updateAdd(Model.testenv, req, res, params);
    }
};