/**
 * Created by Cray on 2017/7/3.
 */
import _ from 'lodash'
import Params from '../../../utils/params'
import Serror from '../../../utils/serror'
import domain from '../../../conf/domain'
import Utils from '../../../utils'
import Entity from '../../../service/entity'
import Model from '../../../models/index'
import {wraper} from '../../../utils/wraper'

let request = require('request');
const md5 = require("blueimp-md5")

request = request.defaults({jar: true})

let _pjList = [];
let _groupList = [];
let _apiList = [];
let _res;
let _pid;
let _groupId;
let _projectId;
let _resError = {
    project: [],
    group: [],
    api: []
};


export default {
    /**
     * 登录apiview
     * @param req
     * @param res
     */
    getPjFromApiView(email, password){
        let res = null
        password = md5(password);
        var formData = {
            email: email,
            password: password
        }
        console.log('开始登陆', formData)
        let rqUrl = `https://apiview.com/User/doLogin?email=${email}&password=${password}`;

        return new Promise((resolve, reject) => {
            request.post({url: rqUrl, formData: formData}, (error, httpResponse, body) => {
                rqUrl = 'https://apiview.com/Project/getList?type=all'
                if (!error && parseInt(httpResponse.statusCode) === 200 && body["errno"] !== 0) {
                    request(rqUrl, (err, httpResponse, body) => {
                        if (!err && parseInt(httpResponse.statusCode) === 200) {
                            let data = JSON.parse(body)
                            res = {
                                data: data.data,
                                code: "200",
                                msg: ""
                            }
                            resolve(res)
                        } else {
                            res = Serror.findError('apiview 获得项目列表失败')
                            reject(res)
                        }
                    })
                } else {
                    res = Serror.findError('apiview 用户名密码错误')
                    reject(res)
                }
            })

        })

    },

    /**
     * 开始导入
     * @param req
     * @param res
     */
    importPjFromApiView(projects, res) {
        let resMsg = null;
        if (_pjList.length > 0) {
           // resMsg = Serror.queryError(res, '正在执行导入操作，请稍后再试', '409');
            resMsg = Serror.operateError('正在执行导入操作，请稍后再试');
            res.json(resMsg)
            return;
        }
        // _.remove(_pjList, (value)=> {
        //     return ids.includes(value["project_id"])
        // })
        _pjList = projects;
        _res = res;
        importPjQueue();
    }
};


/**
 * 导入项目队列
 */
async function importPjQueue() {
    let projectDoc
    if (_pjList.length > 0) {
        let projectdData_apiview = _pjList.pop();
        //创建项目
        let params = {
            name: projectdData_apiview.name,
            version: "1.0",
            type: "web",
            admin: domain.userId,
            lastTime: Date.now(),
            cooperGroup: [{
                userId: domain.userId,
                username: domain.username,
                authority: 2
            }],
        };

        _pid = projectdData_apiview.project_id;

        params = wraper(Model.project, params);

        projectDoc = await Entity.create(Model.project, params).catch(e => {
            _resError.project.push(params)
            importPjQueue();
        })

        let rqUrl = 'https://apiview.com/Api/getList?pid=' + _pid;
        request(rqUrl, (err, httpResponse, body) => {
            let data = JSON.parse(body)
            _groupList = data.data;
            _projectId = projectDoc._id;
            improtGroupQueue(_projectId);
        })

    } else {
        _res.json({
            data: _resError,
            code: '200',
            msg: '导入成功'
        })
    }
}
/**
 * 导入组队列
 * @param projectId
 */
async function improtGroupQueue(projectId) {
    if (_groupList.length > 0) {
        let groupData = _groupList.pop();
        if (groupData["group_name"]) {
            let params = {
                projectId: projectId,
                databaseId: "",
                type: "interface",
                name: groupData["group_name"]
            }

            params = wraper(Model.group, params);

            _apiList = groupData.apis;
            let groupDoc = await Entity.create(Model.group, params).catch(e => {
                _resError.group.push(params)
                _groupId = "-1";
            })
            if (groupDoc._id) {
                _groupId = groupDoc._id;
                improtApiQueue(_projectId, _groupId);
            }
        } else {
            _groupId = "-1";
            improtApiQueue(_projectId, _groupId);
        }
    } else {
        importPjQueue();
    }
}
/**
 * 导入api 队列
 * @param projectId
 * @param groupId
 */
async function improtApiQueue(projectId, groupId) {
    if (_apiList.length > 0) {
        let apiData = _apiList.pop();

        let rqUrl = `https://apiview.com/Api/info?pid=${_pid}&api_id=${apiData.api_id}`
        request(rqUrl, async (err, httpResponse, body) => {
            let data = JSON.parse(body)
            data = data.data;

            let inputParams = [];
            _.forOwn(data.input, (value, index) => {
                inputParams.push({
                    "require": value["para_must"] == "是" ? 1 : 0,
                    "key": value["para_name"],
                    "des": value["para_intro"],
                    "type": value["para_type"],
                    "value": []
                })
            });

            let outputResult;
            try {
                outputResult = JSON.parse(data.output);
            } catch (e) {
                outputResult = {};
            }

            let location = Utils.getLocation(data.url);

            let params = {
                projectId: projectId,
                groupId: groupId,
                enable: 1,
                active: 1,
                host: location.hostname,
                dataType: data.method,
                URI: location.pathname || data.name,
                featureName: data.brief,
                params: inputParams,
                returnData: [],
                remark: data.remark,
                apiJson: {
                    "successResult": outputResult,
                    "errorResult": "{}"
                },
                update: Date.now()
            };

            params = wraper(Model.interfaces, params);

            let interfaceDoc = await Entity.create(Model.interfaces, params).catch(e => {
                console.log(params)
                // Serror.queryError(_res, err);
                _resError.api.push(params)
            })

            improtApiQueue(_projectId, _groupId);

        })
    } else {
        improtGroupQueue(_projectId);
    }
}

