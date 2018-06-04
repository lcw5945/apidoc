/**
 * Created by Cray on 2017/7/3.
 */
import Serror from '../../utils/serror';
import Model from '../../models/index'
import Entity from '../../service/entity'
import Log from 'hefan-debug-log-s'
import axios from 'axios'

export default Object.assign({},

    {
        /**
         * 接口测试登录
         * @param {String} username  测试用户名称
         * @param {String} password  测试用户密码
         * @param {String} loginPath  登录接口path
         * @param {String} loginHost  登录接口host
         * @param {String} method  登录接口请求方式
         * @param {String} projectId  项目ID
         */
        async loginTest(params) {
            let {username, password, loginPath, loginHost, method, projectId} = params,
                res = null,
                doc = null;
            console.log('请求地址',loginHost + loginPath)
            if (method == 'GET') {
                doc = await axios.get(loginHost + loginPath, {
                    params: {
                        data: {
                            "msCode": password,
                            "deviceToken": "B735740D0CE24FFEB729ACB46E2C54F2",
                            "mobile": username,
                            "deviceNo": "0BE9B2CE-2260-42E1-8E33-535B26586419"
                        }
                    }
                }).catch((e) => {
                    console.log('e======>',e)
                    res = Serror.fetchApiError('请求接口失败')
                })
            } else {
                doc = await axios.post(loginPath + loginHost, {
                    data: {
                        "msCode": password,
                        "deviceToken": "B735740D0CE24FFEB729ACB46E2C54F2",
                        "mobile": username,
                        "deviceNo": "0BE9B2CE-2260-42E1-8E33-535B26586419"
                    }
                }).catch((e) => {
                    res = Serror.fetchApiError('请求接口失败')
                })
            }
            console.log('doc',doc)
            if (doc) {
                // 添加测试登录接口路径
                await Entity.update(Model.project, projectId, {loginInfo: {loginPath}}).catch(e => {
                    res = Serror.updateError()
                })
            }


            if (!res) {
                res = {
                    data: doc['data'],
                    code: '200',
                    msg: ''
                }
            }
            //返回数据
            return new Promise((resolve) => {
                resolve(res)
            })

        }
    });