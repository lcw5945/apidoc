/**
 * Created by Cray on 2017/5/25.
 */
import ParamsUtils from '../../../utils/params'
import Serrors from '../../../utils/serror'
import CommonCtrl from '../../../controls/api/common'
import Log from 'hefan-debug-log-s'

export default {
    route(router) {

        /**
         * 接口测试登录
         * @param {String} username  测试用户名称
         * @param {String} password  测试用户密码
         * @param {String} loginPath  登录接口path
         * @param {String} loginHost  登录接口host
         * @param {String} method  登录接口请求方式
         * @param {String} projectId  项目ID
         */
        router.post('/loginTest', async (req, res) => {
            let params = ParamsUtils.bodyValidate(req, res),
                {username, password, loginPath, loginHost, method, projectId} = params,
                resJson = null

            if (ParamsUtils.isObejctId(projectId)) {
                if (loginPath && loginHost && method && username && password) {
                    if (loginPath.indexOf('/') !== 0) {
                        resJson = Serrors.paramsError('登录地址路径错误')
                    } else {
                        resJson = await CommonCtrl.loginTest(params)
                    }
                } else {
                    resJson = Serrors.paramsError('参数错误')
                }
            } else {
                resJson = Serrors.paramsError('项目ID错误')
            }

            res.json(resJson)
        });

    }
};