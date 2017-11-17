/**
 * Created by Cray on 2017/5/25.
 */

import _ from 'lodash';

let crypto = require('crypto');
let path = require('path');

export default {
    /**
     * 用户名密码加密
     * @param str
     * @param key
     * @returns {*}
     */
    md5(str, key) {
        let decipher = crypto.createHash('md5', key)
        if (key) {
            return decipher.update(str).digest()
        }
        return decipher.update(str).digest('hex')
    },
    resolve(dir) {
        return path.join(__dirname, '..', dir)
    },

    getLocation(url){
        var location = {
            protocol: "",
            hostname: "",
            pathname: ""
        };
        
        if(url.indexOf("https") != -1){
            location.protocol = "https://"
            url = url.substring(8);
        }else if(url.indexOf("http") != -1){
            location.protocol = "http://"
            url = url.substring(7);
        }else{
            location.protocol = ""
        }

        let temAry = url.split("/");
        location.hostname = temAry.shift()
        if(temAry.length){
            location.pathname = "/" + temAry.join("/")
        }

        return location;
    },

    formatParams(params) {
        let newdata = {};
        _.forOwn(params, function (value, key) {
            if (key = "file") {
                let arr = value.split("@");
                newdata[key] = arr[0];
                if (arr.length > 1) {
                    if (arr[1].indexOf('x') > -1) {
                        let arr1 = arr[1].split("x");
                        newdata['w'] = arr1[0];
                        newdata['h'] = arr1[1];
                    } else {
                        newdata['w'] = arr[1];
                    }
                }
            } else {
                newdata[key] = value;
            }
        });

        return newdata;
    }
}