/**
 * Created by Cray on 2017/5/25.
 */
export default {
    queryError(res, err, code = '202') {
        res.json({
            data: {},
            code: code,
            msg: err
        });
    },
    serverError(res, err, code = '500') {
        res.set('Content-Type', 'text/plain;charset=utf-8');
        res.status(code).end(err + '\n');
    },
    authError(res){
        res.json({
            data: {},
            code: 403,
            msg: '权限错误'
        });
    },
    loginError(res, code= '402', msg='登录失败 用户名密码错误') {
        res.json({
            data: {},
            code: code,
            msg: msg
        });
    },
}