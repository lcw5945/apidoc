'use strict';

/**
 * Created by Cray on 2016/4/29.
 */
const projectName = typeof _PROJECTNAME !== 'undefined' && _PROJECTNAME ? _PROJECTNAME : '项目名称未配置';
const LEVEL_CONFIG = { 'debug': true, 'log': true, 'info': true, 'warn': true, 'error': true };

const Log = {
    startup: function startup() {
        let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'debug';

        let array = ['debug', 'log', 'info', 'warn', 'error'];
        let enable = false;
        array.forEach(function(type) {
            type == value ? enable = true : LEVEL_CONFIG[type] = false;

            if (enable) {
                LEVEL_CONFIG[type] = true;
            }
        });
    },
    debug: function debug(pageName) {
        for (var _len = arguments.length, msg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            msg[_key - 1] = arguments[_key];
        }

        _consolePrint('debug', pageName, msg);
    },
    log: function log(pageName) {
        for (var _len2 = arguments.length, msg = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            msg[_key2 - 1] = arguments[_key2];
        }

        _consolePrint('log', pageName, msg);
    },
    info: function info(pageName) {
        for (var _len3 = arguments.length, msg = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            msg[_key3 - 1] = arguments[_key3];
        }

        _consolePrint('info', pageName, msg);
    },
    warn: function warn(pageName) {
        for (var _len4 = arguments.length, msg = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            msg[_key4 - 1] = arguments[_key4];
        }

        _consolePrint('warn', pageName, msg);
    },
    error: function error(pageName) {
        for (var _len5 = arguments.length, msg = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            msg[_key5 - 1] = arguments[_key5];
        }

        _consolePrint('error', pageName, msg);
    }
};

if (__DEV) {
    Log.startup('debug');
} else {
    Log.startup('log');
}

function _consolePrint(type, pageName, msg) {
    if (LEVEL_CONFIG[type]) {
        var fn = window.console[type];
        if (fn) {
            fn.apply(window.console, _formatMsg(type, msg));
            _debugImg(type, pageName, msg);
        }
    }
}

function _debugImg(type, pageName, data) {
    var imgData = _paramFormat({ "projectName": projectName, "type": type, "env":process.env.NODE_ENV,"action": "4001", "pageName": pageName, "logData": data });
    var img = new Image();
    img.src = 'http://localhost.hefantv.com:9012/debug.gif?data=' + imgData.data;
}

function _getTime() {
    var d = new Date();
    return String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds());
}

function _paramFormat(data) {
    var result = {};
    result.data = JSON.stringify(data);
    return result;
}
if (typeof window !== 'undefined') {
    window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
        var errorInfo = {
            errorMessage: {
                meaning: '错误信息：',
                msg: errorMessage
            },
            scriptURI: {
                meaning: '出错文件：',
                msg: scriptURI
            },
            lineNumber: {
                meaning: '出错行号：',
                msg: lineNumber
            },
            columnNumber: {
                meaning: '出错列号：',
                msg: columnNumber
            },
            errorObj: {
                meaning: '错误详情：',
                msg: errorObj
            }
        };
        _debugImg('error', scriptURI, errorInfo);
    };
}

function _formatMsg(type, msg) {
    msg.unshift(_getTime() + ' [' + type + '] > ');
    return msg;
}

module.exports = Log;
