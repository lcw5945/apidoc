/**
 * Created by VULCAN on 2017/11/13.
 */

import Utils from '~utils';
import _ from 'lodash';

export default class Request {

    /**
     * 遍历请求头
     **/
    static forRequestHead(head,dataSource){
        head.forEach((data, index) => {
            if (parseInt(data.status) === 1) {
                dataSource[data.key] = data.require
            }
        })
    };

    /**
     * 遍历请求参数
     **/
    static forRequestParame(params, dataSource) {
        params.forEach((param, index) => {
            if (parseInt(param.require) === 1) {
                if (param.subParams && param.subParams.length > 0) {
                    dataSource[param.key] = param.type === 'array' ? [] : {};
                    // dataSource[param.key] = this.returnParamsType(param.type);
                    this.forArr(param.subParams, dataSource[param.key]);
                } else {
                    if (Utils.isObject(dataSource)) {
                        dataSource[param.key] = this.returnParamsType(param.type, param.value);
                    } else {
                        dataSource.push(this.returnParamsType(param.type, param.value, param.key));
                    }
                }
            }
        })
    };

    /**
     * 遍历请求参数subParams
     **/
    static forArr(params, dataSource) {
        this.forRequestParame(params, dataSource);
    };

    /**
     * 根据参数类型赋值
     **/
    static returnParamsType(type, value, key) {
        let returnType;
        switch (type) {
            case 'array':
                return returnType = [];
            case 'object':
                returnType = key ? {[key]: this.forParamsValue(value)} : {};
                return returnType;
            case 'int':
                return returnType = parseInt(this.returnTypeFunc(key, value));
            case 'string':
                return returnType = this.returnTypeFunc(key, value);
            default:
                return returnType = this.returnTypeFunc(key, value);
        }
        return returnType;
    };

    /**
     * 根据有无默认值返回returnType的值
     **/
    static returnTypeFunc(key = '', value) {
        if (value && _.isArray(value)) {
            return value.length === 0 ? key : this.forParamsValue(value);
        }
        return key;
    };

    /**
     * 遍历请求参数值value返回默认参数值
     **/
    static forParamsValue(dataValue) {
        let valueDefault = '';
        dataValue.forEach((data, index) => {
            if (parseInt(data.valueDefault) === 1) valueDefault = data.valueCont;
        })
        return valueDefault
    };
}