/**
 * Created by Cray on 2017/8/1.
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
    getGroups(req, res) {
        let conditions = Params.queryValidate(req, res);
        Operate.queryInfo(Model.group, req, res, conditions);
    },

    /**
     * 删除
     * @param req
     * @param res
     */
    delGroup(req, res) {
        let params = Params.bodyValidate(req, res);
        let opt = {groupId: params.id};

        if(params["projectId"]){
            Model.interfaces.updateByOpts(opt, {groupId: -2}, (err, data) => {
                if (err) {
                } else {
                }
            });
        }else if(params["databaseId"]){
            Model.filed.updateByOpts(opt, {groupId: -2}, (err, data) => {
                if (err) {
                } else {
                }
            });
        }

        Operate.removeByInfo(Model.group, req, res, {id: params.id});
    },

    /**
     * 创建更新
     * @param req
     * @param res
     */
    updateAddGroup(req, res) {
        let params = Params.bodyValidate(req, res);
        // params = _.omit(params, ['projectId', 'databaseId']);
        Operate.updateAdd(Model.group, req, res, params);
    }
};