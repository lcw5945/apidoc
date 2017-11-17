/**
 * Created by Cray on 2017/7/3.
 */
import _ from 'lodash'
import Operate from '../operate';
import Params from '../params';
import Serror from '../serror';
import * as Model from '../../../models';
import domain from '../../../nconf/domain'
export default {
    /**
     * 获得项目列表
     * @param req
     * @param res
     */
    getProjects(req, res) {
        Operate.queryInfoAll(Model.project, req, res);
    },


    /**
     * 删除
     * @param req
     * @param res
     */
    delProject(req, res) {
        let params =  Params.bodyValidate(req, res);
        Model.project.findById(params.id, (err, doc) => {
            if (err) {
                Serror.queryError(res, err);
            } else {
                if(doc.admin === domain.userId || parseInt(domain.authority) > 1){
                    Operate.removeByInfo(Model.project, req, res).then(function (id) {
                        console.log({projectId: params.id})
                        Model.interfaces.removeByOpts({projectId: params.id}, function () {
                        });
                        Model.group.removeByOpts({projectId: params.id}, function () {
                        });
                        Model.statecode.removeByOpts({projectId: params.id}, function () {
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
    updateAddProject(req, res) {
        let params = Params.bodyValidate(req, res);
        if(params.hasOwnProperty("id")){
            Model.project.findById(params.id, (err, doc) => {
                if (err) {
                    Serror.queryError(res, err);
                } else {
                    if(doc.admin === domain.userId || parseInt(domain.authority) > 1){
                        Operate.updateAdd(Model.project, req, res, params);
                    }else{
                        Serror.authError(res);
                    }
                }
            })
        }else{
            params.admin = domain.userId;
            params.lastTime = Date.now();
            params.cooperGroup = [domain.userId];
            Operate.updateAdd(Model.project, req, res, params)
        }
    },

    /**
     * 添加协作管理
     * @param req
     * @param res
     */
    addCooper(req, res) {
        let params = Params.bodyValidate(req, res);
        if(params.hasOwnProperty("projectId")){
            Model.project.findById(params.projectId, (err, doc) => {
                if (err) {
                    Serror.queryError(res, err);
                } else {
                    if(doc.admin === domain.userId){
                        if(params["useId"]){
                            Operate.getDocById(Model.project, params["projectId"]).then(pjDoc => {
                                params["cooperGroup"] = pjDoc["cooperGroup"];

                                Operate.getDocById(Model.user, params["useId"]).then(userDoc => {
                                    if(params["cooperGroup"].includes(userDoc["_id"])){
                                        Serror.queryError(res, '已添加过此用户', '403');
                                    }else{
                                        params["cooperGroup"].push(userDoc["_id"]);
                                        let $p = {};
                                        $p.id = params["projectId"];
                                        $p.cooperGroup = params["cooperGroup"];
                                        Operate.updateAdd(Model.project, req, res, $p);
                                    }
                                }, err => {
                                    Serror.queryError(res, err);
                                })
                            }, err => {
                                Serror.queryError(res, err);
                            });
                        }else{
                            Serror.queryError(res, '用户id为空', '403');
                        }
                    }else{
                        Serror.authError(res);
                    }
                }
            })
        }else{
            Serror.queryError(res, 'project id为空', '403');
        }
    },

    /**
     * 删除协作者
     * @param req
     * @param res
     */
    delCooper(req, res) {
        let params = Params.bodyValidate(req, res);
        if(params["projectId"] && params["useId"]){
            Model.project.findById(params.projectId, (err, doc) => {
                if (err) {
                    Serror.queryError(res, err);
                } else {
                    if(doc.admin === domain.userId){
                        if(params["useId"]){
                            Operate.getDocById(Model.project, params["projectId"]).then(pjDoc => {
                                params["cooperGroup"] = pjDoc["cooperGroup"];

                                Operate.getDocById(Model.user, params["useId"]).then(userDoc => {
                                    let userid = userDoc["_id"];
                                    console.log(userid);
                                    if(params["cooperGroup"].includes(userid)){
                                         _.remove(params["cooperGroup"], function (value) {
                                            return userid == value;
                                        })

                                        let $p = {};
                                        $p.id = params["projectId"];
                                        $p.cooperGroup = params["cooperGroup"];
                                        Operate.updateAdd(Model.project, req, res, $p);
                                    }else{
                                        Serror.queryError(res, '用户不在协作组中', '403');
                                    }
                                }, err => {
                                    Serror.queryError(res, err);
                                })
                            }, err => {
                                Serror.queryError(res, err);
                            });
                        }else{
                            Serror.queryError(res, '用户id为空', '403');
                        }
                    }else{
                        Serror.authError(res);
                    }
                }
            })
        }else{
            Serror.queryError(res, 'project id为空', '403');
        }
    }
};