/**
 * Created by Cray on 2017/5/25.
 */
import _ from 'lodash'
export default {
    /**
     * 查询参数验证
     * @param req
     * @returns {*}
     */
    queryValidate(req) {
        let query = req.query
        if (typeof(query) !== 'object') {
            return null
        }
        return query
    },
    /**
     * 提交参数验证
     * @param req
     * @returns {*}
     */
    bodyValidate(req) {
        let body = req.body
        if (typeof(body) !== 'object') {
            return null
        }
        return body
    },

    tokenValidate(req){
        let params
        if(req.method === "GET"){
            params = this.queryValidate(req)
        }else {
            params = this.bodyValidate(req)
        }

        return params
    },
    /**
     * 判断是否是id
     * @param id
     * @returns {*}
     */
    isObejctId(id){
        if(id && String(id).length === 24){
            return true
        }
        return false
    },
    /**
     * 判断是否是数字
     * @param id
     * @returns {*}
     */
    isNumber(val){
        var regPos = /^\d+$/; // 非负整数
        var regNeg = /^\-[1-9][0-9]*$/; // 负整数
        if(regPos.test(val) || regNeg.test(val)){
            return true;
        }else{
            return false;
        }
    }


}