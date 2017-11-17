/**
 * Created by Cray on 2017/7/3.
 */

import Operate from '../operate';
import Params from '../params';
import * as Model from '../../../models';
import Serror from '../serror';
import domain from '../../../nconf/domain'
export default {
    /**
     * 获得列表
     * @param req
     * @param res
     */
    getDatabases(req, res) {
        Operate.queryInfoAll(Model.database, req, res);
    },

    /**
     * 删除
     * @param req
     * @param res
     */
    delDatabase(req, res) {
        let params =  Params.bodyValidate(req, res);
        Model.database.findById(params.id, (err, doc) => {
            if (err) {
                Serror.queryError(res, err);
            } else {
                if(doc.admin === domain.userId){
                    Operate.removeByInfo(Model.database, req, res).then(function (id) {
                        Model.filed.removeByOpts({databaseId: id}, function () {

                        });
                        Model.group.removeByOpts({databaseId: id}, function () {

                        });
                    });
                }else{
                    Serror.authError(res);
                }
            }
        })
    },

    /**
     * 创建更新
     * @param req
     * @param res
     */
    updateAddDatabase(req, res) {
        let params = Params.bodyValidate(req, res);
        if(params.hasOwnProperty("id")){
            Model.database.findById(params.id, (err, doc) => {
                if (err) {
                    Serror.queryError(res, err);
                } else {
                    if(doc.admin === domain.userId){
                        Operate.updateAdd(Model.database, req, res, params);
                    }else{
                        Serror.authError(res);
                    }
                }
            })
        }else{
            params.admin = domain.userId;
            params.lastTime = Date.now();
            Model.database.createInfo(params, (err, data) => {
                if (err) {
                    Serror.queryError(res, err);
                } else {
                    res.json({
                        data: data,
                        code: "200",
                        msg: "创建成功"
                    });
                }
            });
        }
    }
};