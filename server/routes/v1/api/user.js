import Domain from '../../../conf/domain'
import Params from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import UserCtrl from '../../../controls/api/user/index'


export default {
    route(router) {
        /**
         * 登录
         * @param {String} username  用户名称
         * @param {String} password  用户密码
         */
        router.post('/login', async (req, res) => {
            let params = Params.bodyValidate(req, res),
                resJson

            if (_.isPlainObject(params)) {
                if (params['username'] && params['password']) {
                    resJson = await UserCtrl.login(params)
                } else {
                    resJson = Serrors.paramsNull('账号或密码不能为空')
                }
            } else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })
        /**
         * 登出
         */
        router.post('/logout', async (req, res) => {
            let resJson = await UserCtrl.login()
            res.json(resJson)
        })
        /**
         * 注册
         * @param {String} username  用户名称
         * @param {String} password  用户密码
         */
        router.post('/register', async (req, res) => {
            let params = Params.bodyValidate(req, res),
                resJson

            if (Domain.authority < 1) {
                resJson = Serrors.authError(res);
            } else {
                if (_.isPlainObject(params)) {
                    if (params['username'] && params['password']) {
                        resJson = await UserCtrl.register(params)
                    } else {
                        resJson = Serrors.paramsNull('账号或密码不能为空')
                    }
                } else {
                    resJson = Serrors.paramsError()
                }
            }

            res.json(resJson)
        })

        /**
         * 获得注册用户列表
         */
        router.get('/getRegistUsers', async (req, res) => {
            let params = Params.queryValidate(req, res),
                resJson

            if (Domain.authority < 1) {
                resJson = Serrors.authError(res);
            } else {
                resJson = await UserCtrl.getRegistUsers(params)
            }
            res.json(resJson)
        })

        /**
         * 重置用户密码
         * @param {String} id  用户id
         */
        router.post('/resetRegistUser', async (req, res) => {
            let {userId} = Params.bodyValidate(req, res),
                resJson

            if (Domain.authority < 1) {
                resJson = Serrors.authError(res);
            }else if(Params.isObejctId(userId)){
                resJson = await UserCtrl.resetRegistUser(userId)
            }else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

        /**
         * 删除注册用户
         * @param {String} id  用户id
         */
        router.post('/delRegistUser', async (req, res) => {
            let {userId} = Params.bodyValidate(req, res),
                resJson

            if (Domain.authority < 1) {
                resJson = Serrors.authError(res);
            }else if(Params.isObejctId(userId)){
                resJson = await UserCtrl.delRegistUser(userId)
            }else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

        /**
         * 按条件搜索用户
         * @param {String} username  用户名
         */
        router.get('/searchRegistUsers', async (req, res) => {
            let {username} = Params.queryValidate(req, res),
                resJson

           if(username){
                resJson = await UserCtrl.searchRegistUsers(username)
            }else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

        /**
         * 更新用户
         * @param {String} oldpassword  用户旧密码
         * @param {String} password  用户密码
         */
        router.post('/updateUser', async (req, res) => {
            let params = Params.bodyValidate(req, res),
                resJson

            if(_.isPlainObject(params)  && params['oldpassword']  && params['password']){
                if(params['oldpassword'] == params['password']){
                    resJson = Serrors.operateError('旧密码与新密码相同')
                }else {
                    resJson = await UserCtrl.updateUser(params)
                }
            }else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

        /**
         * 查询内容通过id
         * @param {String} ids
         */
        router.get('/getMulUser', async (req, res) => {
            let {ids} = Params.queryValidate(req, res),
                resJson

            if(ids){
                resJson = await UserCtrl.getMulUser(ids)
            }else {
                resJson = Serrors.paramsError()
            }
            res.json(resJson)
        })

    }
};