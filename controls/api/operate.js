/**
 * Created by Cray on 2017/5/25.
 */
import Serror from './serror';
import Params from './params';
import {wraper} from './wraper';
import * as Model from '../../models';

export default {
    /**
     * 添加更新
     * @param model
     * @param req
     * @param res
     */
    updateAdd(model, req, res, $params) {
        let params = $params || Params.bodyValidate(req, res);
        if (params.hasOwnProperty("id") && params.id != 0) {
            let id = params.id;
            delete params.id;
            model.updateInfo(id, params, (err, data) => {
                if (err) {
                    Serror.queryError(res, err);
                } else {
                    res.json({
                        data: {},
                        code: "200",
                        msg: "更新成功"
                    });
                }
            });
        } else {
            params.hasOwnProperty("id") || (delete params.id);
            params = wraper(model, params);
            model.createInfo(params, (err, data) => {
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
    },

    updateByOpts(model, req, res, options, conditions) {
        model.updateByOpts(options, conditions, (err, data) => {
            if (err) {
                Serror.queryError(res, err);
            } else {
                res.json({
                    data: {},
                    code: "200",
                    msg: "更新成功"
                });
            }
        });
    },
    /**
     * @param model
     * @param req
     * @param res
     */
    queryInfo(model, req, res, $params) {
        let opt = $params || Params.queryValidate(req, res);
        if (opt) {
            model.fetch(opt, (err, doc) => {
                if (err) {
                    Serror.queryError(res, err);
                    return Promise.reject();
                } else {
                    res.json({
                        data: {
                            details: doc
                        },
                        code: "200",
                        msg: ""
                    });
                    return Promise.resolve(doc);
                }
            });
        } else {
            Serror.queryError(res, '查询参数不正确');
            return;
        }
    },
    /**
     * 查询所有信息
     * @param model
     * @param req
     * @param res
     */
    queryInfoAll (model, req, res) {
        model.fetch((err, doc) => {
            if (err) {
                Serror.queryError(res, err);
                return Promise.reject();
            } else {
                res.json({
                    data: {
                        details: doc
                    },
                    code: "200",
                    msg: ""
                });
                return Promise.resolve(doc);
            }
        });
    },

    /**
     * 删除信息
     * @param model
     * @param req
     * @param res
     */
    removeByInfo(model, req, res, $params) {
        let opt = $params || Params.bodyValidate(req, res);
        if (opt.id) {
            return model.removeInfo(opt.id, (err, doc) => {
                if (err) {
                    Serror.queryError(res, err);
                    return Promise.reject();
                } else {
                    res.json({
                        data: {},
                        code: "200",
                        msg: ""
                    });
                    return Promise.resolve(opt.id);
                }
            });
        } else {
            Serror.queryError(res, '参数不正确');
            return Promise.reject();
        }
    },

    /**
     * 通过条件删除
     * @param model
     * @param req
     * @param res
     * @param conditions
     */
    removeByOpts(model, req, res, conditions) {
        model.removeByOpts(conditions, (err, doc) => {
            if (err) {
                Serror.queryError(res, err);
                return Promise.reject();
            } else {
                res.json({
                    data: {},
                    code: "200",
                    msg: ""
                });
                return Promise.resolve(conditions);
            }
        })
    },
    /**
     * 按条件查询
     * @param model
     * @param req
     * @param res
     */
    search(model, req, res, $params) {
        let opt = $params || Params.queryValidate(req, res);
        console.log(opt)
        if (opt) {
            model.find(opt)
                .exec((err, doc) => {
                    if (err) {
                        Serror.queryError(res, err);
                    } else {
                        res.json({
                            data: doc,
                            code: "200",
                            msg: ""
                        });
                    }
                });
        } else {
            Serror.queryError(res, '查询参数不正确');
        }
    },

    /**
     * 查询内容通过id
     * @param model
     * @param id
     */
    getDocById(model, id) {
        return new Promise(function (resolve, reject) {
            model.findById(id, (err, doc) => {
                if (err) {
                    doc = null;
                    reject(err);
                }
                let result = JSON.parse(JSON.stringify(doc));
                resolve(result);
            })
        });

    },

    /**
     * 查询内容通过id
     * @param req
     * @param res
     */
    getDocByMultId(model, req, res) {
        let opt = Params.queryValidate(req, res);
        if (opt && opt.ids) {
            let ids = opt.ids.split(',');
            console.log(ids)
            model.findByMulId(ids, (err, doc) => {
                if (err) {
                    Serror.queryError(res, err);
                } else {
                    res.json({
                        data: doc,
                        code: "200",
                        msg: ""
                    });
                }
            });
        } else {
            Serror.queryError(res, '查询参数不正确');
        }
    }
}