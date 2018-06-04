/**
 * Created by Cray on 2017/7/12.
 */
import { API_HOST } from "../constants/api-host";
import _ from "lodash";
import { hasResponseError } from "../common/http";
import Utils from "~utils";

let fetch = window.fetch;

/**
 * 状态监测
 * @param response
 * @returns {*}
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

/**
 * 解析json
 * @param response
 */
function parseJSON(response) {
  return response.json();
}

/**
 * 解析返回数据
 * @param data
 */
function parseData(data) {
  let result = data;
  if (!hasResponseError(data)) {
    result = data.data;
  }
  return result;
}

/**
 * 参数转换
 * @param url
 * @param params
 * @returns {string}
 */
function transfrom(url, params) {
  if (Utils.isObject(params)) {
    let paramsArray = [];
    _.forOwn(params, function(value, key) {
      if (Utils.isObject(value)) {
        value = JSON.stringify(value);
      }
      paramsArray.push(key + "=" + value);
    });

    params = paramsArray.join("&");
  }

  if (url.search(/\?/) === -1) {
    url += "?" + params;
  } else {
    url += "&" + params;
  }

  return url;
}

/**
 * 格式化连接
 * @param url
 * @param host
 */
function formatUrl(url, host) {
  if (url.indexOf("http://") !== -1) {
    return url;
  }
  if (host) {
    url = `${host}${url}`;
  } else {
    url = `${API_HOST}${url}`;
  }
  return url;
}

/**
 * get 方式请求json
 * @param url
 * @param host
 */
export const fetchJSONGet = (url, host) => params => {
  const variableData = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json"
    },
    credentials: "include"
  };
  let fullUrl = formatUrl(url, host);
  return new Promise(function(resolve, reject) {
    fetch(transfrom(fullUrl, params), variableData)
      .then(checkStatus)
      .then(parseJSON)
      .then(parseData)
      .then(function(data) {
        if (data.code) reject({ status: data.code, msg: data.msg });
        else resolve(data);
      })
      .catch(function(error) {
        reject({ status: error });
        console.log("request failed", error);
      });
  });
};

/**
 * post 方式请求json
 * @param url
 * @param host
 */
export const fetchJSONPost = (url, host) => params => {
  const variableData = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json"
    },
    credentials: "include",
    body: JSON.stringify(params)
  };
  // console.log(`post fetch url ${url} params ${params}`);
  let fullUrl = formatUrl(url, host);
  return new Promise(function(resolve, reject) {
    fetch(fullUrl, variableData)
      .then(checkStatus)
      .then(parseJSON)
      .then(parseData)
      .then(function(data) {
        if (data.code) reject({ status: data.code, msg: data.msg });
        else resolve(data);
      })
      .catch(function(error) {
        console.log("request failed", error);
        reject({ status: error });
      });
  });
};

/**
 * @param options
 * @returns {Promise}
 */
export const fetchTest = (
  options = {
    url: "",
    host: "",
    method: "GET",
    params: {},
    header: {}
  }
) => {
  // console.log(`post fetch url ${url} params ${params}`);
  let fullUrl = formatUrl(options.url, options.host);
  return new Promise(function(resolve, reject) {
    let variableData = {
      method: options.method,
      headers: Object.assign(
        {
          "Content-Type": "application/json",
          accept: "application/json"
        },
        options.header
      )
    };

    // console.log('fetch headers', variableData)

    if (options.method === "POST") {
      variableData = Object.assign(variableData, {
        body: JSON.stringify(options.params)
      });

      fetch(fullUrl, variableData)
        .then(checkStatus)
        .then(parseJSON)
        // .then(parseData)
        .then(function(data) {
          resolve(data);
        })
        .catch(function(error) {
          reject({ status: error });
        });
    } else {
      fetch(transfrom(fullUrl, options.params), variableData)
        .then(checkStatus)
        .then(parseJSON)
        // .then(parseData)
        .then(function(data) {
          resolve(data);
        })
        .catch(function(error) {
          reject({ status: error });
          console.log("request failed", error);
        });
    }
  });
};
