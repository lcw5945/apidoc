/**
 * Created by Cray on 2017/8/17.
 */
import _ from 'lodash'
import Model from '../models'
import Utils from '../utils'

export const wraper = (model, params) => {
    if (model === Model.user) {
        params = _.pick(params, ['username', 'password', 'authority', 'regTime', 'loginTime', 'ssoUser']);
        return Object.assign({}, {
            username: "",
            password: "",
            authority: 0,
            ssoUser: {},
            regTime: "",
            loginTime: ""
        }, params)
    }
    if (model === Model.filed) {
        params = _.pick(params, ['databaseId', 'name', 'type', 'length', 'required', 'primary', 'groupId', 'description']);
        return Object.assign({}, {
            databaseId: "",
            name: "",
            type: "",
            length: "",
            required: "",
            primary: "",
            groupId: "",
            lastTime: Utils.now,
            description: ""
        }, params)
    }

    if (model === Model.group) {
        params = _.pick(params, ['projectId', 'databaseId', 'type', 'name']);
        return Object.assign({}, {
            projectId: "",
            databaseId: "",
            type: "",
            lastTime: Date.now(),
            name: ""
        }, params)
    }

    if (model === Model.project) {
        params = _.pick(params, ['name', 'version', 'type', 'lastTime', 'admin', 'cooperGroup', 'adminInfo', 'loginInfo']);
        return Object.assign({}, {
            name: "",
            version: "",
            type: "",
            lastTime: "",
            admin: "",
            cooperGroup: [],
            adminInfo: {},
            loginInfo: {},
        }, params)
    }

    if (model === Model.database) {
        params = _.pick(params, ['name', 'version', 'lastTime', 'admin']);
        return Object.assign({}, {
            name: "",
            version: "",
            lastTime: Date.now(),
            admin: "",
        }, params)
    }

    if (model === Model.statecode) {
        params = _.pick(params, ['projectId', 'scode', 'description', 'groupId', 'type', 'remark', 'json', 'paramList']);
        return Object.assign({}, {
            projectId: "",
            scode: "",
            description: "",
            groupId: "",
            paramList: [],
            type: "",
            remark: "",
            json: {},
            lastTime: Date.now()
        }, params)
    }

    if (model === Model.testenv) {
        params = _.pick(params, ['name', 'URI', 'projectid']);
        return Object.assign({}, {
            name: "",
            lastTime: Date.now(),
            URI: "",
            projectid: ""
        }, params)
    }

    if (model === Model.itemplete) {
        params = _.pick(params, ['name', 'data', 'projectId']);
        return Object.assign({}, {
            name: "",
            lastTime: Date.now(),
            projectId: "",
            data: {}
        }, params)
    }

    if (model === Model.admin) {
        params = _.pick(params, ['username', 'password', 'authority', 'regTime', 'loginTime']);
        return Object.assign({}, {
            username: "",
            password: "",
            authority: 0,
            regTime: "",
            loginTime: Date.now()
        }, params)
    }


    if (model === Model.interfaces) {
        params = _.pick(params, ['projectId', 'groupId', 'enable', 'active', 'tag', 'creator', 'manager', 'proxyHost', 'dataType', 'host',
            'URI', 'featureName', 'params', 'returnData', 'remark', 'apiJson', 'extraInfo', 'update']);
        return Object.assign({}, {
            projectId: "",
            groupId: "",
            enable: 1,
            host: '',
            active: 0,
            tag: '',
            creator: '',
            manager:'',
            proxyHost: "",
            dataType: "",
            URI: "",
            featureName: "",
            params: [],
            returnData: [],
            remark: "",
            apiJson: {
                "successResult": "{}",
                "errorResult": "{}",
                "mockResult": "{}"
            },
            extraInfo: {},
            update: Date.now()
        }, params)
    }
}