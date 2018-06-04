/**
 * Created by Cray on 2017/7/3.
 */
import _ from 'lodash'
import Serror from '../../../utils/serror';
import Model from '../../../models/index'
import domain from '../../../conf/domain'
import Entity from '../../../service/entity'

import Log from 'hefan-debug-log-s'
import axios from 'axios'

export default Object.assign({},
    {
        /**
         * 获得项目列表
         */
        async getProjects() {
            let res = null,
                userDoc = null,
                ids = null,
                projectDoc = null;

            projectDoc = await Entity.fetch(Model.project, 'lastTime', {}).catch(e => {
                res = Serror.findError('query project list error')
            })

            // 根据项目的admin查找对应的user
            ids = _.uniq(projectDoc.map(val => val.admin))

            userDoc = await Entity.fetch(Model.user, ids).catch(e => {
                res = Serror.findError('query user list error')
            })


            //封装admin的数据
            projectDoc.map(val => {
                let userData = userDoc.filter(value => value._id == val.admin)[0];
                val.adminInfo = _.pick(userData, ['username', 'loginTime']);
            })


            if (!res) {
                res = {
                    data: {
                        details: projectDoc
                    },
                    code: '200',
                    msg: ''
                }
            }
            //返回数据
            return new Promise((resolve) => {
                resolve(res)
            })

        },


        /**
         * 删除
         * @param req
         * @param res
         */
        async delProject(id) {
            let res = null
            let projectDoc = await Entity.findById(Model.project, id).catch(e => {
                res = Serror.findError('project 查询失败')
            })

            if (projectDoc.admin === domain.userId || parseInt(domain.authority) > 1) {
                await Entity.remove(Model.project, id).catch(e => {
                    res = Serror.delError('project 删除失败')
                })

                await Entity.removeBase(Model.interfaces, {projectId: id}).catch(e => {
                    res = Serror.delError('interfaces 删除失败')
                })
                await Entity.removeBase(Model.group, {projectId: id}).catch(e => {
                    res = Serror.delError('group 删除失败')
                })
                await Entity.removeBase(Model.statecode, {projectId: id}).catch(e => {
                    res = Serror.delError('statecode 删除失败')
                })

            } else {
                res = Serror.Unauthorized('没有权限')
            }

            if (!res) {
                res = {
                    data: '',
                    code: '200',
                    msg: ''
                }
            }
            //返回数据
            return new Promise((resolve) => {
                resolve(res)
            })
        },

        /**
         * 创建更新
         * @param {Object} params  项目
         * @param res
         */
        async updateAddProject(params) {
            let res = null,
                doc = null;
            if (params.hasOwnProperty("id")) { // 修改项目
                let projectDoc = await Entity.findById(Model.project, params.id).catch(e => {
                    res = Serror.findError('project查询失败')
                })
                if (projectDoc.admin === domain.userId || parseInt(domain.authority) > 1) {
                    doc = await Entity.update(Model.project, params.id, params).catch(e => {
                        res = Serror.findError('project更新失败')
                    })
                } else {
                    Serror.Unauthorized("没有权限")
                }
            } else { // 增加项目
                params.admin = domain.userId;
                params.lastTime = Date.now();
                params.cooperGroup = [{
                    userId: domain.userId,
                    username: domain.username,
                    authority: 2
                }];
                doc = await Entity.create(Model.project, params).catch(e => {
                    res = Serror.findError('project增加失败')
                })
                // 包装数据
                doc._doc.adminInfo = {
                    username: domain.username
                }
            }

            if (!res) {
                res = {
                    data: doc,
                    code: '200',
                    msg: ''
                }
            }
            //返回数据
            return new Promise((resolve) => {
                resolve(res)
            })


        },

        /**
         * 添加协作管理
         * @param req
         * @param res
         * {userId, authority} //auth 0 mock权限 1 预留 2 接口权限
         * type : add 增加 del 删除
         */
        async editCooper(params, type) {

            let {projectId, useId, authority} = params,
                res = null,
                projectDoc = null,
                userDoc = null,
                cooperGroup = null,
                doc = null;

            // 查询项目
            projectDoc = await Entity.findById(Model.project, projectId).catch(e => {
                res = Serror.findError('project 查询失败')
            })
            cooperGroup = projectDoc['cooperGroup'] || []
            // 有权限
            if (projectDoc.admin === domain.userId || domain.authority > 2) {

                userDoc = await Entity.findById(Model.user, useId).catch(e => {
                    res = Serror.findError('user 查询失败')
                })

                if (type === 'add') { // 添加协作组
                    if (_.some(cooperGroup, {userId: useId})) {
                        // Serror.queryError(res, '已添加过此用户', '403');
                        _.forEach(cooperGroup, function (item, key) {
                            if (item.userId == useId) {
                                item.authority = authority || 0
                            }
                        });
                    } else {
                        cooperGroup.push({
                            userId: useId,
                            username: userDoc["username"],
                            authority: authority || 0
                        });
                    }
                } else { //删除协作组
                    if (_.some(cooperGroup, {userId: useId})) {
                        _.remove(cooperGroup, function (value) {
                            return useId == value.userId;
                        })
                    }
                }

                doc = await Entity.updateBase(Model.project, {_id: projectId}, {cooperGroup}).catch(e => {
                    res = Serror.updateError()
                })

            } else {
                res = Serror.Unauthorized('没有权限')
            }

            if (!res) {
                res = {
                    data: doc,
                    code: '200',
                    msg: ''
                }
            }
            //返回数据
            return new Promise((resolve) => {
                resolve(res)
            })

        },

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
                doc = null

            Log.info('请求地址', loginHost + loginPath)
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