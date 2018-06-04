/**
 * Created by Cray on 2017/5/25.
 */
import ParamsUtils from '../../../utils/params'
import Serrors from '../../../utils/serror'
import _ from "lodash"
import ProjectCtrl from '../../../controls/api/project'
import Log from 'hefan-debug-log-s'

export default {
    route(router) {
        /**
         * 添加协作管理
         */
        router.post('/addCooper', async(req, res) => {
            let params = ParamsUtils.bodyValidate(req) || {},
                data = null;
            if (!ParamsUtils.isObejctId(params.projectId) || !params.useId || !ParamsUtils.isNumber(params.authority)) {
                data = Serrors.paramsError()
            } else {
                data = await ProjectCtrl.editCooper(params, 'add')
            }
            res.json(data)
        });
        /**
         * 删除协作管理
         */
        router.post('/delCooper', async(req, res) => {
            let params = ParamsUtils.bodyValidate(req) || {},
                data = null;
            if (!params.projectId || !params.useId) {
                data = Serrors.paramsError()
            } else {
                data = await ProjectCtrl.editCooper(params, 'del')
            }
            res.json(data)

        });
        /**
         * 获得项目列表
         */
        router.get('/getProjects', async(req, res) => {
            let data = await ProjectCtrl.getProjects()
            res.json(data)
        });
        /**
         * 删除
         * @param {String} id 项目id
         */
        router.post('/delProject', async(req, res) => {
            let {id} = ParamsUtils.bodyValidate(req),
                data = null;
            if (ParamsUtils.isObejctId(id)) {
                data = await ProjectCtrl.delProject(id)
            } else {
                data = Serrors.paramsError()
            }
            res.json(data)
        });
        /**
         * 创建更新
         */
        router.post('/updateAddProject', async(req, res) => {
            let data = null,
                params = ParamsUtils.bodyValidate(req);
            if (params.id && !ParamsUtils.isObejctId(params.id) || !params.name) {
                data = Serrors.paramsError('参数错误')
            } else {
                data = await ProjectCtrl.updateAddProject(params)
            }

            res.json(data)

        });

        /**
         * 导入项目
         */
        router.post('/importPjFromApiView', async(req, res) => {
            let data = null;
            let {projects} = ParamsUtils.bodyValidate(req, res);

            if (projects) {
                await ProjectCtrl.importPjFromApiView(projects, res)
            } else {
                data = Serrors.paramsError()
                res.json(data)
            }

        });
        /**
         * 获得apiveiw项目
         */
        router.post('/getPjFromApiView', async(req, res) => {

            let {email, password} = ParamsUtils.bodyValidate(req, res),
                data = null;
            if (email && password) {
                data = await ProjectCtrl.getPjFromApiView(email, password).catch(msg => {
                    data = msg
                })
            } else {
                data = Serrors.paramsError('用户名 密码为空')
            }
            res.json(data)
        });

        /**
         * 接口测试登录
         * @param {String} username  测试用户名称
         * @param {String} password  测试用户密码
         * @param {String} loginPath  登录接口path
         * @param {String} loginHost  登录接口host
         * @param {String} method  登录接口请求方式
         * @param {String} projectId  项目ID
         */
        router.post('/loginTest', async(req, res) => {
            let params = ParamsUtils.bodyValidate(req, res),
                {username, password,loginPath,loginHost,method,projectId} = params,
                resJson = null

            if(ParamsUtils.isObejctId(projectId)){
                if (loginPath && loginHost && method && username && password) {
                    if(loginPath.indexOf('/') !== 0){
                        resJson = Serrors.paramsError('登录地址路径错误')
                    }else {
                        resJson = await ProjectCtrl.loginTest(params)
                    }
                } else {
                    resJson = Serrors.paramsError('参数错误')
                }
            }else {
                resJson = Serrors.paramsError('项目ID错误')
            }

            res.json(resJson)
        });

    }
};