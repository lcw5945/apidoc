/**
 * Created by VULCAN on 2018/2/27.
 */
import Domain from '../../../conf/domain'
import Params from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import UserCtrl from '../../../controls/api/user/index'

export default {
    route(router) {
        /**
         * 获取管理员
         **/
        router.get('/getAdmins',async (req,res)=>{
            let resJson = null
            if (Domain.authority !== 3) {
                resJson = Serrors.authError(res)
            } else {
                resJson = await UserCtrl.getAdmins()
            }

            res.json(resJson)
        })

        /**
         * 删除管理员
         **/
        router.post('/delAdmin', async (req,res)=>{
            let params = Params.bodyValidate(req, res) || {},
                resJson
            if (Domain.authority !== 3) {
                resJson = Serrors.authError(res)
            } else {
                if (Params.isObejctId(params.id)) {
                    resJson = await UserCtrl.delAdmin({_id:params.id})
                }else {
                    resJson = Serrors.paramsError()
                }
            }

            res.json(resJson)
        })

        /**
         * 编辑普通管理员
         **/
        router.post('/updateAddAdmin', async (req,res)=>{
            let params = Params.bodyValidate(req, res) || {},
                resJson
            if (Domain.authority !== 3) {
                resJson = Serrors.authError(res)
            } else {
                if (_.isPlainObject(params) && params.username && params.password) {
                    delete params.token;
                    resJson = await UserCtrl.updateAddAdmin(params)
                } else {
                    resJson = Serrors.paramsError()
                }
            }

            res.json(resJson)
        })

        /**
         * 编辑超级管理员
         **/
        router.post('/updateSuperAdmin', async (req,res)=>{
            let params = Params.bodyValidate(req, res) || {},
                resJson
            if (Domain.authority !== 3) {
                resJson = Serrors.authError(res)
            } else {
                if (params["id"] && params["password"] && Object.keys(params).length === 2) {
                    if (params.token) delete params.token
                    resJson = await UserCtrl.updateSuperAdmin(params)
                } else {
                    resJson = Serrors.paramsError()
                }
            }
            res.json(resJson)
        })
    }
}