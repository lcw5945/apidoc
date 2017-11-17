/**
 * Created by Cray on 2017/5/25.
 */
import _ from 'lodash'

export default {
    /**
     * 查询参数验证
     * @param req
     * @param res
     * @returns {*}
     */
    queryValidate(req, res) {
        let query = req.query;
        if (typeof(query)!=="object") {
            res.json({
                data: {},
                code: "208",
                msg: "参数格式错误"
            });
            return null;
        }
        // query = Object.keys(query).length > 0 ? query : null;

        return _.omit(query, ['token']);
    },

    /**
     * 提交参数验证
     * @param req
     * @param res
     * @returns {*}
     */
    bodyValidate(req, res) {
        let body = req.body;
        if (typeof(body)!=="object") {
            res.json({
                data: {},
                code: "208",
                msg: "参数格式错误"
            });
            return null;
        }

        return _.omit(body, ['token']);;
    },

    /**
     * token 验证
     * @param req
     * @param res
     * @returns {*}
     */
    tokenValidate(req, res){
        let body = req.body;
        let query = req.query;
        if (typeof(body)!=="object" || typeof(query)!=="object") {
            res.json({
                data: {},
                code: "208",
                msg: "参数格式错误"
            });
            return null;
        }

        if(query.hasOwnProperty('token'))
        {
            return query;
        }

        return body;
    }
}