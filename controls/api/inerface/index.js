/**
 * Created by Cray on 2017/7/3.
 */

import Operate from '../operate';
import Params from '../params';
import Serror from '../serror';
import * as Model from '../../../models';
import domain from '../../../nconf/domain'
export default {
    /**
     * 获得接口列表
     * @param req
     * @param res
     */
    getInterfaces(req, res) {
        let conditions = Params.queryValidate(req, res);
        if (conditions.groupId === -1) {
            delete conditions.groupId;
        }
        Operate.queryInfo(Model.interfaces, req, res, conditions);
    },

    /**
     * 删除接口
     * @param req
     * @param res
     */
    delInterfaces(req, res) {
        let params = Params.bodyValidate(req, res);
        if (!params.projectId) {
            Serror.queryError(res, 'projectId is null');
            return
        }
        Model.project.findById(params.projectId, (err, doc) => {
            if (err) {
                Serror.queryError(res, err);
            } else {
                if (doc.cooperGroup && doc.cooperGroup.includes(domain.userId)) {
                    Operate.removeByInfo(Model.interfaces, req, res);
                } else {
                    Serror.authError(res);
                }
            }
        })

    },

    /**
     * 创建更新接口
     * @param req
     * @param res
     */
    updateAddInterfaces(req, res) {
        let params = Params.bodyValidate(req, res);
        params.update = Date.now();
        if (!params.projectId) {
            Serror.queryError(res, 'projectId is null');
            return
        }
        Model.project.findById(params.projectId, (err, doc) => {
            if (err) {
                Serror.queryError(res, err);
            } else {
                if (doc.cooperGroup && doc.cooperGroup.includes(domain.userId)) {
                    Operate.updateAdd(Model.interfaces, req, res, params);
                } else {
                    Serror.authError(res);
                }
            }
        })

    }
};