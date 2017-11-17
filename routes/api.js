/**
 * Created by Cray on 2017/3/13.
 */
import express from 'express';
import ApiControl from '../controls/api';
import inerfaceApi from './api/inerface';
import projectApi from './api/project';
import statecodeApi from './api/statecode';
import testenvApi from './api/testenv';
import databaseApi from './api/database';
import fieldApi from './api/field';
import userApi from './api/user';
import groupApi from './api/group';
import itempleteApi from './api/itemplete';
import Params from '../controls/api/params';
import domin from '../nconf/domain';
import _ from 'lodash'
import constant from '../nconf/constant'

var jwt = require('jsonwebtoken');
var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
router.all('*', cors, auth);

/**
 * 跨域设置
 * @param req
 * @param res
 * @param next
 */
function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");

    next();
}

/**
 * 验证登录状态
 * @param req
 * @param res
 * @param next
 */
function auth (req, res, next) {
    if(req.method === 'OPTIONS'){
        res.json({});
        return;
    }

    let params = null;
    if(Params.tokenValidate(req,res)){
        params = Params.tokenValidate(req,res);
    }else{
        res.json({
            data: {},
            code: "208",
            msg: "参数格式错误"
        });
        return;
    }


    if(req.path === '/login'){
    }else{
        if(!params.token){
            res.json({
                data: {},
                code: "209",
                msg: "token不存在"
            });
            return;
        }

        let token = params.token;
        let decoded = null;

        try {
            decoded = jwt.verify(token, constant.secret);
            _.forOwn(decoded.data, (value, key) => {
                domin[key] = value;
            })
        } catch(err) {
            res.json({
                data: {},
                code: "210",
                msg: "token 已过期"
            });
            return ;
        }

        console.log(domin, 'domin');
        console.log(decoded, 'decoded');

        // if(Math.floor(Date.now() / 1000) > decoded.exp){
        //     res.json({
        //         data: {},
        //         code: "211",
        //         msg: "token已过期"
        //     });
        //     return;
        // }
    }
    next();
}

inerfaceApi.route(router, ApiControl);
projectApi.route(router, ApiControl);
statecodeApi.route(router, ApiControl);
testenvApi.route(router, ApiControl);
userApi.route(router, ApiControl);
fieldApi.route(router, ApiControl);
groupApi.route(router, ApiControl);
databaseApi.route(router, ApiControl);
itempleteApi.route(router, ApiControl);

module.exports = router;