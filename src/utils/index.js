/**
 * Created by Cray on 2016/12/6.
 */


Date.prototype.format = function (fmt) {
    const o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1,
            (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1,
                (RegExp.$1.length === 1) ?
                    (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
        }
    }
    return fmt;
};


class Utils {

    static isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }

    static toUrl(url) {
        let a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('target', '_blank');

        let event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        a.dispatchEvent(event);
    }

    static click(ele) {
        let event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        ele.dispatchEvent(event);
    }

    static href(url) {
        window.location.href = url;
    }

    static isImg(path) {
        let reg = /.+(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$/;
        return reg.test(path);
    }

    static isObject(value) {
        return Object.prototype.toString.apply(value) === '[object Object]';
    }

    static each(obj, callback) {
        var value,
            i = 0,
            length = obj.length,
            isArray = Object.prototype.toString.apply(obj) === '[object Array]';
        if (isArray) {
            for (; i < length; i++) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                value = callback.call(obj[i], i, obj[i]);
                if (value === false) {
                    break;
                }
            }
        }
        return obj;
    }

    static equals(x, y) {
        if (x === y) {
            // 针对+0 不等于 -0的情况
            return x !== 0 || 1 / x === 1 / y;
        }
        // 针对NaN的情况
        return x !== x && y !== y;
    }

    static  merge(original, extended) {
        for (let key in extended) {
            let ext = extended[key];
            if (typeof(ext) !== 'object' || ext instanceof HTMLElement || ext === null) {
                original[key] = ext;
            }
            else {
                if (!original[key] || typeof(original[key]) !== 'object') {
                    original[key] = (Array.isArray(ext)) ? [] : {};
                }
                this.merge(original[key], ext);
            }
        }
        return original;
    }

    static copy(object) {
        if (!object || typeof(object) !== 'object' || object instanceof HTMLElement) {
            return object;
        }
        else if (Array.isArray(object)) {
            let array = [];
            for (let i = 0, l = object.length; i < l; i++) {
                array[i] = this.copy(object[i]);
            }
            return array;
        }
        else {
            let obj = {};
            for (let j in object) {
                obj[j] = this.copy(object[j]);
            }
            return obj;
        }
    }


    static extend(target) {
        var slice = Array.prototype.slice;
        slice.call(arguments, 1).forEach(function (source) {
            for (let key in source) {
                if (source[key] !== undefined) {
                    target[key] = source[key];
                }
            }
        });
        return target;
    }

    static keys(o) {
        let a = [];
        for (let k in o) if (o[k]) {
            a.push(k);
        }
        return a;
    }

    static by(name, minor) { //
        return function (o, p) {
            var a, b;
            if (o && p && typeof o === 'object' && typeof p === 'object') {
                a = o[name];
                b = p[name];
                if (a === b) {
                    return typeof minor === 'function' ? minor(o, p) : 0;
                }
                if (typeof a === typeof b) {
                    return a < b ? -1 : 1;
                }
                return typeof a < typeof b ? -1 : 1;
            } else {
                throw new Error('Expected an object when sorting by ' + name);
            }
        };
    }

    static throttle(func, wait) {
        var ctx, args, rtn, timeoutID;
        var last = 0;

        return function throttled() {
            ctx = this;
            args = arguments;
            var delta = new Date() - last;
            if (!timeoutID) {
                if (delta >= wait) call();
                else timeoutID = setTimeout(call, wait - delta);
            }
            return rtn
        };
        function call() {
            timeoutID = 0;
            last = +new Date();
            rtn = func.apply(ctx, args);
            ctx = null;
            args = null;
        }
    }


    static parseUrlToData(url) {
        var result = null;
        var temp = url.split("?");
        if (temp.length > 1) {
            result = {};
            var a = temp[1].split("&");
            this.each(a, function (index, str) {
                var b = str.split("=");
                result[b[0]] = b[1];
            });
        }
        return result;
    }

    /**
     * 查询地址栏 通过key参数
     * @param name
     * @returns {*}
     */
    static getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return null;
    }


    static getPreDate(pre) {
        var c = new Date();
        c.setDate(c.getDate() - pre);
        return this.formatDate(c);
    }

    static formatDate(d) {
        return d.getFullYear() + "-" + this.getMonth1(d.getMonth()) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes();
    }

    static getMonth1(m) {
        m++;
        if (m < 10)
            return "0" + m.toString();
        return m.toString();
    }

    static adaptDefaultSize(designWidth, rem2px) {
        var d = window.document.createElement('div');
        d.style.width = '1rem';
        d.style.display = "none";
        var head = window.document.getElementsByTagName('head')[0];
        head.appendChild(d);
        var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
        d.remove();
        document.documentElement.style.fontSize = window.innerWidth / designWidth * rem2px / defaultFontSize * 100 + '%';
        var st = document.createElement('style');
        var portrait = "@media screen and (min-width: " + window.innerWidth + "px) {html{font-size:" + ((window.innerWidth / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}";
        var landscape = "@media screen and (min-width: " + window.innerHeight + "px) {html{font-size:" + ((window.innerHeight / (designWidth / rem2px) / defaultFontSize) * 100) + "%;}}"
        st.innerHTML = portrait + landscape;
        head.appendChild(st);
        return defaultFontSize
    }

    static compressImg(imgPath, width) {
        if (imgPath.indexOf("img.hefantv.com") > -1) {
            return imgPath + "@" + width + "w";
        }
        return imgPath;
    }

    static isLocalStorageSupported() {
        var testKey = 'test',
            storage = window.localStorage;
        try {
            storage.setItem(testKey, 'testValue');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 是否支持sessionStroage
     * @returns {boolean}
     */
    static isSessionStorageSupported() {
        var testKey = 'test',
            storage = window.sessionStorage;
        try {
            storage.setItem(testKey, 'testValue');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    static replace(string, find, replace) {
        return string.replace(new RegExp(find, 'g'), replace);
    }

    static replaceAll(string, find, replace) {
        return string.replace(new RegExp(find.replace(/([.*+?\^=!:flex{}()|\[\]\/\\])/g, '\\$1'), 'g'), replace);
    }

    static cutUrlForlastParam() {
        return window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1);
    }

    /**
     * 获得未来几天的日期
     * @param step
     */
    static getStepDate(step = 0, fmt = 'yyyy-MM-dd hh:mm:ss') {
        const date = new Date();
        date.setDate(date.getDate() + step);
        return date.format(fmt)
    }

    static getDomById(id) {
        return document.getElementById(id);
    }

    static getValueById(id) {
        var dom = document.getElementById(id);
        if (dom) {
            return dom.value;
        }
        return null;
    }

    static setValueById(id, data) {
        var dom = document.getElementById(id);
        if (dom) {
            dom.value = data;
        }
    }

    static foramtUrl(host, uri) {
        host = host.indexOf("http") != -1 ? host.substring(7) : host;
        if (!uri) return uri;
        return uri.indexOf('/') === 0 ? host + uri : host + '/' + uri;

    }

    /**
     * 把uri（http://后）的链接的 // 替换成 /
     * */
    static resolveUrl(uri) {
        return uri.replace(/\/\//g,"/").replace(/:\//g,"://")
    }



    /**
     * 判读两个对象是否相等
     **/
    static isObjectValueEqual(a, b) {

        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);


        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            if (JSON.stringify(a[propName]) !== JSON.stringify(b[propName])) {
                return false;
            }
        }

        return true;
    }
}

export default Utils;