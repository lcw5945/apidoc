/**
 * Created by Cray on 2017/5/25.
 */
import Operate from '../operate';
import Params from '../params';
import Serror from '../serror';
import * as Model from '../../../models';
import Utils from '../utils';
import domain from '../../../nconf/domain'
import constant from '../../../nconf/constant'

var jwt = require('jsonwebtoken');

const { defautlPwd, secret } = constant;


export default {

    /**
     * 删除管理员
     * @param req
     * @param res
     */
    delAdmin(req, res) {
        if(domain.authority !== 3){
            Serror.authError(res);
            return;
        }
        Operate.removeByInfo(Model.admin, req, res);
    },

    /**
     * 获得管理员列表
     * @param req
     * @param res
     */
    getAdmins(req, res) {
        if(domain.authority !== 3){
            Serror.authError(res);
            return;
        }
        Operate.queryInfoAll(Model.admin, req, res);
    },

    /**
     * 更新超级管理员
     * @param req
     * @param res
     */
    updateSuperAdmin(req, res) {
        if(domain.authority !== 3){
            Serror.authError(res);
            return;
        }

        let params = Params.bodyValidate(req, res);
        if (params) {
            if (params["id"] && params["password"] && Object.keys(params).length == 2) {
                let id = params.id;
                delete params.id;
                Model.admin.updateSuperInfo(id, params, (err, data) => {
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
                res.json({
                    data: "",
                    code: "210",
                    msg: "超级管理员只可以更新密码"
                });
            }
        }
    },

    /**
     * 更新
     * @param req
     * @param res
     */
    updateAddAdmin(req, res) {
        if(domain.authority !== 3){
            Serror.authError(res);
            return;
        }

        let body = req.body.data;
        body = JSON.parse(body)
        body.password = Utils.md5(body.password);
        req.body.data = JSON.stringify(body);
        Operate.updateAdd(Model.admin, req, res);
    },

    /**
     * 重置注册用户
     * @param req
     * @param res
     */
    resetRegistUser(req, res){
        if(domain.authority < 1){
            Serror.authError(res);
            return;
        }

        let conditions = Params.bodyValidate(req, res);
        Operate.updateAdd(Model.user,req, res, {id: conditions.userId, password: Utils.md5(defautlPwd)});
    },

    /**
     * 获得注册用户
     * @param req
     * @param res
     */
    getRegistUsers(req, res) {
        if(domain.authority < 1){
            Serror.authError(res);
            return;
        }

        let conditions = Params.queryValidate(req, res);
        conditions.authority = {$lte : 2};
        Operate.queryInfo(Model.user, req, res, conditions);
    },

    /**
     * 删除用户
     * @param req
     * @param res
     */
    delRegistUser(req, res) {
        if(domain.authority < 1){
            Serror.authError(res);
            return;
        }
        let conditions = Params.bodyValidate(req, res);
        Operate.removeByInfo(Model.user, req, res, {id: conditions.userId});
    },

    /**
     * 更新用户
     * @param req
     * @param res
     */
    updateUser(req, res){
        let options = Params.bodyValidate(req, res);
        let conditions = {password: Utils.md5(options.password)};
        Operate.updateByOpts(Model.user,req, res, {_id: domain.userId, password: Utils.md5(options.oldpassword)}, conditions);
    },

    /**
     * 按条件搜索用户
     * @param req
     * @param res
     */
    searchRegistUsers(req, res) {
        // if(domain.authority < 1){
        //     Serror.authError(res);
        //     return;
        // }
        let params = Params.queryValidate(req, res);
        if (params && params.username) {
            let reg = new RegExp(params.username);
            Operate.search(Model.user, req, res, {username: reg});
        }else{
            Serror.queryError(res, "只能按照username 查询");
        }
    },



    /**
     * 获得多个用户通过ids
     */
    getMulUser(req, res){
        Operate.getDocByMultId(Model.user, req, res);
    },

    /**
     * 注册用户
     * @param req
     * @param res
     */
    register(req, res) {
        if(domain.authority < 1){
            Serror.authError(res);
            return;
        }

        let params = Params.bodyValidate(req, res);
        if (params && params.username && params.password) {
            params.password = params.password.toLocaleLowerCase()
            Model.user.fetch({username: params.username}, (err, doc)=> {
                if (err) {
                    Serror.queryError(res, err);
                } else {
                    if(doc.length>0){
                        res.json({
                            data: {},
                            code: "409",
                            msg: "用户已存在"
                        });
                    }else{
                        let userObj = {};
                        userObj.username = params.username;
                        userObj.password = Utils.md5(params.password);
                        console.log(userObj.password)
                        userObj.authority = 0;
                        userObj.regTime = new Date().getTime();
                        userObj.loginTime = "";
            
                        if(parseInt(params['authority']) && parseInt(params['authority']) === 2 && domain.authority === 3){
                            userObj.authority = 2;
                        }
            
                        Model.user.register(userObj, function (err, data) {
                            if (err) {
                                Serror.queryError(res, err);
                            } else {
                                // req.session.userid = data._id;
                                // req.session.username = data.username;
                                res.json({
                                    data: {
                                        username: data.username,
                                        userid: data._id
                                    },
                                    code: "200",
                                    msg: "注册成功"
                                });
                            }
                        })
                    }
                }
            })
            
        } else {
            Serror.queryError(res, "用户名或密码不能为空", '504');
        }
    },

    /**
     * 登录
     * @param req
     * @param res
     */
    login(req, res) {
        let user = Params.bodyValidate(req, res);
        console.log(user);
        if (user) {
            if (user.username && user.password) {
                let userObj = {};
                userObj.username = user.username;
                userObj.password = Utils.md5(user.password.toLocaleLowerCase());

                Model.user.login(userObj, function (err, doc) {
                    if (err) {
                        Serror.loginError(res, '502', '登录失败 服务器出错')
                    } else if (doc) {
                        Model.user.updateInfo(doc._id, {loginTime: new Date().getTime()}, function (err, doc) {
                            if (err) {
                                console.log('更新用户登录时间失败');
                            }
                        });

                        let data = {
                            username: doc.username,
                            userId: doc._id,
                            authority: doc.authority
                        };
                        let token = jwt.sign({
                            // exp: Math.floor(Date.now() / 1000) + (5*60*60),
                            data: data
                        }, secret, {expiresIn: '5h'}); //, {expiresIn: '5h'}


                        res.json({
                            data: {
                                username: doc.username,
                                userId: doc._id,
                                auth: doc.authority,
                                token: token
                            },
                            code: "200",
                            msg: "登录成功"
                        });
                    }else {
                        Serror.loginError(res)
                    }
                })
            } else {
                res.json({
                    data: {},
                    code: "504",
                    msg: "用户名或密码不能为空"
                });
            }
        }
    },

    /**
     * 登出
     * @param req
     * @param res
     */
    logout(req, res) {
        if (req.session.userid) {
            req.session.userid = '';
            req.session.username = '';
        }

        res.json({
            data: null,
            code: "200",
            msg: "退出成功"
        });
    }
};