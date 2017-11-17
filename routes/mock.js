import express from 'express';
import mockApi from '../controls/mock'

let router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('invok time', Date.now());
    next();
});

router.all('*', cors, mockApi.connecter);

/**
 * 跨域设置
 * @param req
 * @param res
 * @param next
 */
function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authinfo");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");


    next();
}

module.exports = router;