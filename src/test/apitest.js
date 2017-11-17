/**
 * Created by lichunwei on 2017/7/22.
 */


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
 * 参数转换
 * @param url
 * @param params
 * @returns {string}
 */
function transfrom(url, params) {
    if (params) {
        let paramsArray = [];
        _.forOwn(params, function (value, key) {
            paramsArray.push(key + '=' + value);
        });

        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&');
        } else {
            url += '&' + paramsArray.join('&');
        }
    }
    return url;
}

/**
 * 格式化连接
 * @param url
 * @param host
 */
function formatUrl(url, host) {
    if(host){
        url = `${host}${url}`
    } else {
        url = `${API_HOST}${url}`
    }
    return url;
}

/**
 * get 方式请求json
 * @param url
 * @param host
 */
 const fetchJSONGet = (url, host) => params => {
    let fullUrl = formatUrl(url, host);
    return new Promise(function (resolve, reject) {
        fetch(transfrom(fullUrl, params))
            .then(checkStatus)
            .then(parseJSON)
            .then(function (data) {
                console.log('request succeeded with json response by GET', data);
                resolve(data);
            })
            .catch(function (error) {
                reject({status: error.response.status});
                console.log('request failed', error);
            });
    });

};

/**
 * post 方式请求json
 * @param url
 * @param host
 */
 const fetchJSONPost = (url, host) => params => {
    const variableData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    };
    let fullUrl = formatUrl(url, host);
    return new Promise(function (resolve, reject) {
        fetch(fullUrl, variableData)
            .then(checkStatus)
            .then(parseJSON)
            .then(function (data) {
                console.log('request succeeded with json response by POST', data);
                resolve(data);
            }).catch(function (error) {
            console.log('request failed', error);
            reject({status: error.response.status});
        })
    });
};

let host = 'http://localhost:8803'

const testAddCooper = fetchJSONPost('/api/addCooper', host);

const testUserLogin = fetchJSONPost('/api/login', host);
