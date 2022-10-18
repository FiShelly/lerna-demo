import axios from 'axios';
import { deepCopy } from './deep-copy.mjs';

const http = axios.create({
    timeout: 20000,
});

http.interceptors.request.use(config => {
    removePending(config);
    addPending(config);
    config.headers['Content-Type'] = 'application/json';
    return config;
});

http.interceptors.response.use(response => {
    removePending(response.config);
    if (!response) {
        return Promise.reject({
            errcode: 500
        });
    }
    response = response.data;
    if (response.errcode === 0) {
        return Promise.resolve(response.data);
    } else if (!('errcode' in response)) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response);
    }
}, error => {
    error.config && removePending(error.config);
    if (axios.isCancel(error)) {
        return Promise.reject({
            errcode: 999998,
            error: error,
            errmessage: error.message
        });
    } else if (!error.response) {
        return Promise.reject({
            errcode: 999999,
            error: error,
            errmessage: '网络异常',
        });
    }
    const statusCode = error.response.status;
    const errorData = error.response.data;
    if (errorData) {
        return Promise.reject(errorData);
    }
    return Promise.reject({
        errcode: statusCode,
        errmessage: error.message
    });
});

const pendingMap = new Map();

/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
function getPendingKey (config) {
    let {url, method, params, data} = config;
    if (typeof data === 'string') data = JSON.parse(data); // response里面返回的config.data是个字符串对象
    return [ url, method, JSON.stringify(params), JSON.stringify(data) ].join('&');
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config
 */
function addPending (config) {
    const pendingKey = getPendingKey(config);
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
        if (!pendingMap.has(pendingKey)) {
            pendingMap.set(pendingKey, cancel);
        }
    });
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function removePending (config) {
    const pendingKey = getPendingKey(config);
    if (pendingMap.has(pendingKey)) {
        const cancelToken = pendingMap.get(pendingKey);
        cancelToken(pendingKey);
        pendingMap.delete(pendingKey);
    }
}

export function mergeData (defaultData, data) {
    if (!defaultData) {
        return data;
    }
    if (data instanceof FormData) {
        Object.keys(defaultData).forEach((x) => {
            if (!data.has(x)) {
                data.append(x, defaultData[x]);
            }
        });
    } else {
        data = Object.assign(deepCopy(defaultData), data);
    }
    return data;
};

const modifyArguments = function (data) {
    if (!(data instanceof Object)) {
        return data;
    }
    let hasFile = false;
    Object.keys(data).forEach((x) => {
        if (data[x] instanceof window.File) {
            hasFile = true;
        } else if (data[x] instanceof window.Blob) {
            hasFile = true;
        }
    });
    if (hasFile) {
        let formData = new FormData();
        Object.keys(data).forEach((x) => {
            formData.append(x, data[x]);
        });
        return formData;
    }
    return data;
};

export function get (url, data, body) {
    return http.get(url, {params: data, data: body});
}

export function post (url, data) {
    return http.post(url, modifyArguments(data));
}

export function getHttp () {
    return http;
}
