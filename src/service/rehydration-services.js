/**
 * Created by Cray on 2017/8/14.
 */
import {persistStore} from 'redux-persist';
import ReduxPersist from '~constants/persist-config';
import Local from '~utils/local';
import _ from "lodash";

const KEY_PREFIX = 'reduxPersist:';
const blacklist = ReduxPersist.storeConfig.blacklist || []
const whitelist = ReduxPersist.storeConfig.whitelist || false

/**
 * 更新持久化
 * @param store
 */
export const updateReducers = (store) => {
    if (ReduxPersist.active) {
        const reducerVersion = ReduxPersist.reducerVersion;
        const config = ReduxPersist.storeConfig;

        persistStore(store, config);

        let localVersion = Local.getItem(ReduxPersist.cacheType.REDUCERVERSION);
        if (localVersion !== reducerVersion) {
            persistStore(store, config, () => {
                persistStore(store, config);
            }).purge([]);
            Local.setItem(ReduxPersist.cacheType.REDUCERVERSION, reducerVersion);
        }
    }
};

/**
 * 获得持久化数
 * @returns {{}}
 */
export const getStoredState = (type) => {
    const reducerVersion = ReduxPersist.reducerVersion;
    let localVersion = Local.getItem(ReduxPersist.cacheType.REDUCERVERSION);
    if (localVersion !== reducerVersion) {
        Local.setItem(ReduxPersist.cacheType.REDUCERVERSION, reducerVersion);
        return {};
    }

    let allKeys = [];
    for (let key in localStorage) {
        if (key.includes(KEY_PREFIX)) {
            allKeys.push(key);
        }
    }
    let restoredState = {}
    let persistKeys = allKeys.filter((key) => key.indexOf(KEY_PREFIX) === 0).map((key) => key.slice(KEY_PREFIX.length))

    let keysToRestore = persistKeys.filter(passWhitelistBlacklist)
    let restoreCount = keysToRestore.length
    if (restoreCount === 0) {
        return restoredState;
    }
    keysToRestore.forEach((key) => {
        restoredState[key] = Local.getJSON(createStorageKey(key));
    })


    invalidata(restoredState["entity"]);
    Local.setItem(createStorageKey("entity"), restoredState["entity"]);

    if (type) {
        return restoredState[type];
    }
    return restoredState;
}

/**
 * 更新持久化数据
 * @returns {{}}
 */
export const setStoredState = (type, data) => {
    Local.setItem(createStorageKey(type), data)
}

/**
 * 解析黑白名单
 * @param key
 * @returns {boolean}
 */
function passWhitelistBlacklist(key) {
    if (whitelist && whitelist.indexOf(key) === -1) return false
    if (blacklist.indexOf(key) !== -1) return false
    return true
}
/**
 * 创建带key存储
 * @param key
 * @returns {string}
 */
function createStorageKey(key) {
    return `${KEY_PREFIX}${key}`
}

/**
 * 强制刷新数据失效
 * @param data
 */
function invalidata(data) {
    _.forOwn(data, (item, key) => {
        if (item.hasOwnProperty("didInvalidate")) {
            item.didInvalidate = true;
        } else {
            invalidata(item);
        }
    })
}
