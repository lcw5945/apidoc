import _ from 'lodash';
import Model from '../../models/index'
import Constant from '../../conf/constant'
import Entity from '../../service/entity'
import Serrors from '../../utils/serror'
import Log from 'hefan-debug-log-s'

let request = require('request');
request = request.defaults({jar: true})

export default {
    async connecter(req, res){
        let data = null,
            interfaceDoc = null;
        let conditions = formatConditions(req)

        interfaceDoc = await Entity.find(Model.interfaces, conditions).catch(err => {
            data = Serrors.findError('interfaces 查询失败')
        })
        if (!data && !interfaceDoc.length) {
            res.json(Serrors.findError('interfaces 接口不存在 '));
            return;
        }

        interfaceDoc = interfaceDoc && interfaceDoc[0]

        let apiData = JSON.parse(JSON.stringify(interfaceDoc));
        let method = apiData.dataType;
        let mParams = apiData.params;
        let proxyHost = apiData.proxyHost || Constant.proxyHost;

        let params = method == "GET" ? req.query : req.body;

        if (params["data"]) {
            // **** Start 参数检查
            let emptyKey = '';

            for (let i = 0; i < mParams.length; i++) {
                let p = mParams[i];
                if ((p.require == "1" || p.require == "是") && !params[p.key]) {
                    emptyKey = p.key;
                    break;
                }
            }

            if (emptyKey) {
                res.json({
                    data: "请求错误，必须参数 " + emptyKey + " 为空",
                    code: "405",
                    msg: ""
                });
                return;
            }
            // **** End
        }
        if (apiData["active"] && apiData["active"] === 1) {
            apiProxy(req, res, proxyHost, method, params);
        } else {
            let resData = apiData["apiJson"] || {}
            resData = resData["mockResult"] || resData["successResult"] || {}
            res.json(resData);
        }

    }
}

/**
 * 接口代理
 * @param {*} req
 * @param {*} res
 * @param {*} method
 * @param {*} params
 */
function apiProxy(req, res, proxyHost, method, params) {
    let URI = req.path;
    if (proxyHost.indexOf('http://') == -1 && proxyHost.indexOf('https://') == -1) {
        res.json({
            code: '490',
            msg: `代理域名协议头为空 ${proxyHost}`
        })
        return
    }
    let headers = req.headers;
    Log.log(`origin headers ${ JSON.stringify(req.headers) }`)
    if (method == "GET") {
        URI = URI + "?" + serializeParameters(params)
        let options = {
            url: resolveUrl(proxyHost + URI),
            headers: {authinfo: headers.authinfo || "",
                buriedPoint: headers.buriedPoint || headers.buriedpoint || ""
            }
        }

        Log.log('method get')
        Log.log('options', options)
        request(options, (err, httpResponse, body) => {
            if (!err && parseInt(httpResponse.statusCode) === 200) {
                let data = JSON.parse(body)
                res.json(data)
            } else {
                Log.error({
                    path: req.path,
                    params: req.query || req.body,
                    method: req.method,
                    message: err || "",
                    status: "",
                    stack: ""
                })
                res.json({
                    options: options,
                    err: err,
                    msg: "请求出错"
                })
                return false;
            }
        })
    } else {
        let url = proxyHost + URI;
        let options = {
            url: resolveUrl(url), form: params, headers: {authinfo: headers.authinfo || "",
                buriedPoint: headers.buriedPoint || headers.buriedpoint || ""
            }
        }
        request.post(options, (err, httpResponse, body) => {
            if (err) {
                Log.error({
                    path: req.path,
                    params: req.query || req.body,
                    method: req.method,
                    message: err || "",
                    status: "",
                    stack: ""
                })
                res.json({
                    url: url,
                    msg: err
                })
                return false;
            } else if (!err && parseInt(httpResponse.statusCode) === 200) {
                let data = JSON.parse(body)
                res.json(data)
            }
        })
    }
}

/**
 * 把uri（http://后）的链接的 // 替换成 /
 * */
function resolveUrl(uri) {
    return uri.replace(/\/\//g, "/").replace(/:\//g, "://")
}

/**
 * 参数序列号
 */
function serializeParameters(parameters) {
    let keys = Object.keys(parameters),
        i, k, len = keys.length,
        sortStr = '';

    if (keys.length == 0) {
        return ""
    }
    keys.sort();

    for (i = 0; i < len; i++) {
        k = keys[i];
        if (sortStr) {
            sortStr += '&' + k + '=' + encodeURIComponent(parameters[k])
        } else {
            sortStr = k + '=' + encodeURIComponent(parameters[k])
        }
    }

    return sortStr
}


function formatConditions(req) {
    let URI = req.path;
    if (URI.indexOf('/') === 0) {
        URI = URI.substring(1)
    }

    return {URI: new RegExp(URI)}
}
