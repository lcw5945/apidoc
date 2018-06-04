/**
 * Created by Cray on 2017/8/14.
 */
import {whitelist, blacklist} from '../reducers';
const project_searchApi_key = "HF:apidoc-searchApi";
const project_searchCode_key = "HF:apidoc-searchCode";
const project_searchTag_key = "HF:apidoc-searchTag";

export default {
    active: true,
    reducerVersion: '1.0.1',
    storeConfig: {
        whitelist: whitelist,
        blacklist: blacklist,
    },
    cacheType: {
        REDUCERVERSION: 'HF:apidoc-reducerversion',
        USERINFO: 'reduxPersist:user'
    },
    expires: 24 * 60 * 60 * 1000
}
export {project_searchApi_key, project_searchCode_key, project_searchTag_key};
