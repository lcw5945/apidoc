import _ from 'lodash'
import crypto from 'crypto'
import path from 'path'

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

    get now(){
        return `${Date.now()}`
    },

    browserSniff(navigator) {
        var nAgt = navigator.userAgent,
            name = navigator.appName,
            fullVersion = '' + parseFloat(navigator.appVersion),
            majorVersion = parseInt(navigator.appVersion, 10),
            nameOffset,
            verOffset,
            ix;

        if ((navigator.appVersion.indexOf('Windows NT') !== -1) && (navigator.appVersion.indexOf('rv:11') !== -1)) {
            name = 'IE';
            fullVersion = '11;';
        }
        else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
            name = 'IE';
            fullVersion = nAgt.substring(verOffset + 5);
        } else if ((verOffset = nAgt.indexOf('Edge')) !== -1) {
            name = 'Edge';
            fullVersion = nAgt.substring(verOffset + 5);
        }
        else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
            name = 'Chrome';
            fullVersion = nAgt.substring(verOffset + 7);
        }
        else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
            name = 'Safari';
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                fullVersion = nAgt.substring(verOffset + 8);
            }
        }
        else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
            name = 'Firefox';
            fullVersion = nAgt.substring(verOffset + 8);
        }
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            name = nAgt.substring(nameOffset, verOffset);
            fullVersion = nAgt.substring(verOffset + 1);

            if (name.toLowerCase() == name.toUpperCase()) {
                name = navigator.appName;
            }
        }
        if ((ix = fullVersion.indexOf(';')) !== -1) {
            fullVersion = fullVersion.substring(0, ix);
        }
        if ((ix = fullVersion.indexOf(' ')) !== -1) {
            fullVersion = fullVersion.substring(0, ix);
        }
        majorVersion = parseInt('' + fullVersion, 10);
        if (isNaN(majorVersion)) {
            fullVersion = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }
        return {
            name: name,
            version: majorVersion,
            win: navigator.platform.indexOf("Win") == 0,
            wechat: /micromessenger/.test(nAgt.toLowerCase()),
            qq: /qq/.test(nAgt.toLowerCase()),
            weibo: /weibo/.test(nAgt.toLowerCase()),
            ios: /(iPad|iPhone|iPod)/g.test(nAgt),
            android: /(Android)/g.test(nAgt),
            mobile: (/AppleWebKit.*Mobile.*/).test(nAgt)
        };
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