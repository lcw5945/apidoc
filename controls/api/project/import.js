/**
 * Created by Cray on 2017/7/3.
 */
import _ from 'lodash'
import Operate from '../operate';
import Params from '../params';
import Serror from '../serror';
import Utils from '../utils'
import * as Model from '../../../models';
import domain from '../../../nconf/domain'
import { wraper } from '../wraper';

let request = require('request');
const md5 = require("blueimp-md5")

request = request.defaults({ jar: true })

let _pjList = [];
let _groupList = [];
let _apiList = [];
let _res;
let _pid;
let _groupId;
let _projectId;
let _resError={
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
    getPjFromApiView(req, res){
        let { email, password } = Params.bodyValidate(req, res);
        if(email && password){
            password = md5(password);
            var formData = {
                email: email,
                password: password
            }
            console.log('开始登陆', formData)
            let rqUrl = `https://apiview.com/User/doLogin?email=${email}&password=${password}`;
            request.post({url:rqUrl, formData: formData}, (error, httpResponse, body) => {
                console.log(body)
                rqUrl = 'https://apiview.com/Project/getList?type=all'
                if(!error && parseInt(httpResponse.statusCode) === 200 && body["errno"] !== 0){
                    request(rqUrl,(err, httpResponse, body) => {
                        if(!err && parseInt(httpResponse.statusCode) === 200){
                            let data = JSON.parse(body)
                            res.json({
                                data: data.data,
                                code: "200",
                                msg: ""
                            })
                        }else{
                            Serror.queryError(res, '获得项目列表失败', '403');
                        }
                    })
                }else{
                    Serror.queryError(res, "用户名密码错误" , '503');
                }
            })
        }else{
            Serror.queryError(res, '用户名 密码为空', '403');
        }
    },

    /**
     * 开始导入
     * @param req
     * @param res
     */
    importPjFromApiView(req, res) {
        if(_pjList.length > 0){
            Serror.queryError(res, '正在执行导入操作，请稍后再试', '409');
            return;
        }
        let { projects } = Params.bodyValidate(req, res);
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
function importPjQueue() {
    if(_pjList.length > 0){
        let projectdData = _pjList.pop();
        //创建项目
        let params = {
            name: projectdData.name,
            version: "1.0",
            type: "web",
            admin : domain.userId,
            lastTime : Date.now(),
            cooperGroup :  [domain.userId],
        };

        _pid = projectdData.project_id;

        params = wraper(Model.project, params);

        Model.project.createInfo(params, (err, doc) => {
            if (err) {
                _resError.project.push(params)
                importPjQueue();
            } else {
                let rqUrl = 'https://apiview.com/Api/getList?pid=' + _pid;
                request(rqUrl,(err, httpResponse, body) => {
                    let data = JSON.parse(body)
                    _groupList = data.data;
                    _projectId = doc._id;
                    improtGroupQueue(_projectId);
                })
            }
        });
    }else{
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
function improtGroupQueue(projectId) {
    if(_groupList.length > 0) {
        let groupData = _groupList.pop();
        if(groupData["group_name"]){
            let params = {
                projectId: projectId,
                databaseId: "",
                type: "interface",
                name: groupData["group_name"]
            }

            params = wraper(Model.group, params);
            Model.group.createInfo(params, (err, data) => {
                _apiList = groupData.apis;
                if (err) {
                    _resError.group.push(params)
                    _groupId = "-1";
                }else{
                    _groupId = data._id;
                }

                improtApiQueue(_projectId, _groupId);
            });
        }else{
            _groupId = "-1";
            improtApiQueue(_projectId, _groupId);
        }
    }else{
        importPjQueue();
    }
}
/**
 * 导入api 队列
 * @param projectId
 * @param groupId
 */
function improtApiQueue(projectId, groupId)
{
    if(_apiList.length > 0) {
        let apiData = _apiList.pop();

        let rqUrl = `https://apiview.com/Api/info?pid=${_pid}&api_id=${apiData.api_id}`
        request(rqUrl,(err, httpResponse, body) => {
            let data = JSON.parse(body)
            data = data.data;

            let inputParams = [];
            _.forOwn(data.input, (value, index) => {
                inputParams.push({
                    "require" : value["para_must"] == "是" ? 1 : 0,
                    "key" : value["para_name"],
                    "des" : value["para_intro"],
                    "type" : value["para_type"],
                    "value" : []
                })
            });

            let outputResult;
            try {
                outputResult = JSON.parse(data.output);
            }catch (e){
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
                    "successResult" : outputResult,
                    "errorResult" : "{}"
                },
                update: Date.now()
            };

            params = wraper(Model.interfaces, params);

            Model.interfaces.createInfo(params, (err, data) => {
                if (err) {
                    console.log(params)
                    // Serror.queryError(_res, err);
                    _resError.api.push(params)
                }

                improtApiQueue(_projectId, _groupId);
            });
        })
    }else{
        improtGroupQueue(_projectId);
    }
}

