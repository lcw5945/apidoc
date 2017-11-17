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
    getITempletes(req, res) {
        Operate.queryInfoAll(Model.itemplete, req, res);
    },

    /**
     * 删除
     * @param req
     * @param res
     */
    delITemplete(req, res) {
        Operate.removeByInfo(Model.itemplete, req, res);
    },

    /**
     * 创建更新
     * @param req
     * @param res
     */
    updateAddITemplete(req, res) {
        let params = Params.bodyValidate(req, res);
        params.lastTime = Date.now();
        Operate.updateAdd(Model.itemplete, req, res, params);
    }
};