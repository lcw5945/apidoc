
import _ from 'lodash';
import Serror from './api/serror';
import * as Model from '../models';
import Constant from '../nconf/constant'

let request = require('request');
request = request.defaults({ jar: true })
    
export default {
    connecter(req, res){

        if(req.method === 'OPTIONS'){
            res.json({});
            return;
        }

        let conditions = formatConditions(req)
       Model.interfaces.fetch(conditions, (err, doc) => {
        if (err) {
            Serror.queryError(res, err);
        } else {
            console.log(doc);
            let apiData = JSON.parse(JSON.stringify(doc[0]));
            let method = apiData.dataType;
            let mParams = apiData.params;
            let proxyHost = apiData.proxyHost || Constant.proxyHost;

            let params = method == "GET" ? req.query : req.body;
            console.log('req params', params);        
            // let cParams = params;

            // if(params["data"]){
            //     cParams = JSON.parse(params.data)
            // }

            if(params["data"]){
                // **** Start 参数检查
                let emptyKey = '';

                for(let i=0; i<mParams.length; i++){
                    let p = mParams[i];
                    if((p.require == "1" || p.require == "是") && !params[p.key]){
                        emptyKey = p.key;
                        break;
                    }
                }

                if(emptyKey){
                    res.json({
                        data: "请求错误，必须参数 "+ emptyKey +" 为空",
                        code: "405",
                        msg: ""
                    });
                    return ;
                }
                // **** End
            }

            if(apiData["active"] && apiData["active"] === 1){
                apiProxy(req, res, proxyHost, method, params);
            }else{
                let resData = apiData["apiJson"] || {}
                resData = resData["successResult"] || {}
                res.json(resData);
            }
            
        }  
       })
    }
}

/**
 * 接口代理
 * @param {*} req 
 * @param {*} res 
 * @param {*} method 
 * @param {*} params 
 */
function apiProxy(req, res, proxyHost, method, params){
    let URI = req.path;
    console.log('proxy request')
    console.log(proxyHost, method, params)
    console.log("headers ", req.headers)
   let headers = req.headers;
   if(method == "GET"){
        URI = URI + "?" +  serializeParameters(params)
        let options = {
            url : resolveUrl(proxyHost + URI),
            headers : {authinfo: headers.authinfo}
        }
        console.log('method get')
        console.log('options', options)
        request(options ,(err, httpResponse, body) => {
            if (!err && parseInt(httpResponse.statusCode) === 200) {
                let data = JSON.parse(body)
                res.json(data)
            }else{
                res.json({
                    options: options,
                    err: err,
                    msg: "请求出错"
                })
                return false;
            }
        })
   }else{
        let url =  proxyHost + URI;
        let options = {
            url: resolveUrl(url), form: params, headers : headers
        }
        console.log('method post');
        console.log('options', options);
        request.post(options, (err, httpResponse, body) => {
            if(err){
                res.json({
                    url: url,
                    msg: err
                })
                return false;
            }else if (!err && parseInt(httpResponse.statusCode) === 200) {
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
    return uri.replace(/\/\//g,"/").replace(/:\//g,"://")
}

/**
 * 参数序列号
 */
function serializeParameters(parameters) {
    let keys = Object.keys(parameters),
    i, k, len = keys.length,
    sortStr = '';
    
    if(keys.length == 0){
        return ""
    }
  keys.sort();
  
  for (i = 0; i < len; i++) {
    k = keys[i];
    if(sortStr){
        sortStr += '&' + k + '=' + parameters[k]
    }else{
        sortStr = k + '=' + parameters[k]
    }
  }

  return sortStr
}


function formatConditions(req) {
   let URI = req.path;
   if(URI.indexOf('/') === 0){
      URI = URI.substring (1)
   }

   return { URI: new RegExp(URI) }
}
