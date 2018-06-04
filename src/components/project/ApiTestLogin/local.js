/**
 * Created by user on 2017/11/21.
 */

import evnConfig from '~constants/evn-config';
import Utils from '~utils';
import Local from '~utils/local';
import _ from 'lodash';
import * as ajax from '~lib/ajax';

const key = 'HF:apidoc-logindata';
let evn = evnConfig.evn;


/** 存储的结构
 * key：HF:apidoc-logindata
 * value:{
        'evnName':{ //环境
                "projectId":{
                                data:{},
                                checkedKeys:[],
                                loginTime:123123,
                                serverTime:123123,
                                options:{}
                            },
         },
    }
 * */


let keyIndex = 0;
class ApiLoginLocal {
    constructor(option = {}) {

        if (ApiLoginLocal.unique !== undefined) { //单例模式
            return ApiLoginLocal.unique;
        }
        ApiLoginLocal.unique = this;

        this.allData = this.getAll();

    }

    /**
     * 得到所有的数据
     * */
    getAll() {
        let d = JSON.parse(Local.getItem(key)) || {};
        if (!d[evn]) {
            d[evn] = {};
        }
        return d;
    }

    /**
     * 根据项目Id得到接口数据
     * */
    getUrls(projectId) {
        if (!this.allData[evn][projectId]) {
            this.allData[evn][projectId] = {};
        }

        return this.allData[evn][projectId]
    }

    /**
     * 更新localStore数据
     * */
    update(param = {projectId: '', accountObj: {data: {}, json: {}, checkedKeys: []}}, options) {
        this.allData[evn][param.projectId] = param.accountObj;
        this.allData[evn][param.projectId]['options'] = options;
        Local.setItem(key, JSON.stringify(this.allData))
    }

    /**
     * 保存localstore数据
     * */
    save(param = {projectId: '', accountObj: {data: {}, json: {}, checkedKeys: []}}, options) {
        let time = {
            serverTime: '',
            loginTime: new Date().getTime()
        }
        Object.assign(param.accountObj, time)
        this.update(param, options)
    }

    /**
     * 为数据增加key，格式化为树形结构
     * */
    addKey(treeData) {
        keyIndex = 0;
        return this.formatTreeData(treeData);
    }

    isObject(value) {
        return typeof value == "object"
    }

    /**
     * 格式化树形结构数据
     * */
    formatTreeData(treeData) {
        let obj = [];
        if (this.isObject(treeData)) {
            for (let i in treeData) {
                keyIndex++;
                if (this.isObject(treeData[i])) {
                    obj.push({
                        title: i,
                        key: keyIndex,
                        children: this.formatTreeData(treeData[i])
                    });
                } else {
                    obj.push({
                        title: i + ' : ' + treeData[i],
                        key: keyIndex,
                    });
                }
            }
        }

        return obj;
    }

    /**
     * 得到数据 和 checkedKeys
     * */
    getJsonData(param = {projectId: ''}) {
        let urls = this.getUrls(param.projectId)
        return urls;
    }


    /**
     * 得到系统服务器时间
     * */
    getServerTime(param = {url: ''}) {
        if (!param.url) {
            return
        }
        if (param.url.indexOf("tester") != -1) {
            param.url = "http://testh5api.hefantv.com"
        } else if (param.url.indexOf("aposter") != -1) {
            param.url = "http://h5api.adposer.cn"
        } else {
            param.url = "http://h5api.hefantv.com"
        }

        let opt = {
            url: '/connector/v1/h5/getSystemTime',
            host: param.url,
            method: 'GET',
            params: {},
            header: {}
        }

        return ajax.fetchTest(opt);
    }

    /**
     * 登陆
     * */
    async getLoginTime(param = {projectId: '', url: ''}) {

        let loginTime = new Date().getTime(), serverTime;
        await this.getServerTime(param).then((obj) => {
            serverTime = obj.data;
            loginTime = new Date().getTime();
        });

        return {
            serverTime,
            loginTime
        }
    }

    /**
     * 增加登陆时间和服务器时间
     * */
    addTimes(param = {projectId: '', url: ''}) {
        let json = this.getJsonData(param);
        let options = {}
        if (json['options']) {
            options = json['options']
        }

        this.getLoginTime(param).then((data) => {
            Object.assign(json, data);
            this.update({
                projectId: param.projectId,
                accountObj: json,
            }, options)
        });
    }
}


export default new ApiLoginLocal();





