/**
 * Created by Cray on 2017/5/25.
 */

import Log from 'hefan-debug-log-s'

const CODE = {
    PARAMS_NULL: 400,   //参数为空
    UNAUTHORIZED: 401,   //用户验证错误
    PARAMS_ERROR: 402,   //参数错误
    OPERATE_ERROR: 403,  //用户操作错误
    CREATE_ERROR: 501,  //创建失败
    FIND_ERROR: 502,  //查询失败
    UPDATE_ERROR: 503,  //更新失败
    DEL_ERROR: 504,  //删除失败
    FETCHAPI_ERROR: 505,  //请求第三方接口失败
}
const POST_CODE = [CODE.CREATE_ERROR, CODE.FIND_ERROR, CODE.UPDATE_ERROR, CODE.DEL_ERROR]


export default {

    paramsNull(msg = '参数为空') {
        return {
            code: CODE.PARAMS_NULL,
            data: null,
            msg
        }
    },
    paramsError(msg = '参数错误') {
        return {
            code: CODE.PARAMS_ERROR,
            data: null,
            msg
        }
    },
    createError(msg = '创建失败') {
        return {
            code: CODE.CREATE_ERROR,
            data: null,
            msg
        }
    },
    findError(msg = '查询失败') {
        return {
            code: CODE.FIND_ERROR,
            data: null,
            msg
        }
    },
    updateError(msg = '更新失败') {
        return {
            code: CODE.UPDATE_ERROR,
            data: null,
            msg
        }
    },
    delError(msg = '删除失败') {
        return {
            code: CODE.DEL_ERROR,
            data: null,
            msg
        }
    },
    operateError(msg = '操作失败') {
        return {
            code: CODE.OPERATE_ERROR,
            data: null,
            msg
        }
    },
    Unauthorized(msg = '用户验证错误') {
        return {
            code: CODE.UNAUTHORIZED,
            data: null,
            msg
        }
    },
    fetchApiError(msg = '请求第三方接口失败') {
        return {
            code: CODE.FETCHAPI_ERROR,
            data: null,
            msg
        }
    },
    /**
     * 根据code发送error
     * @param {Object} ctx koa上下文
     * **/
    postError (req, res, data) {
        let {code, msg} = data || {}
        if (POST_CODE.includes(code) && req.path != '/api/postDebug') {
            Log.error(`ERROR: ${req.method} ${req.hostname + req.path} ${data.msg}`)
            return true
        }
        return false
    },

    serverError(res, err, code = '500') {
        res.set('Content-Type', 'text/plain;charset=utf-8');
        res.status(code).end(err + '\n');
    }
}