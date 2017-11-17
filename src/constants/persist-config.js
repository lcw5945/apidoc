/**
 * Created by Cray on 2017/8/14.
 */
import { whitelist, blacklist } from '../reducers';

export default {
    active: true,
    reducerVersion: '1.0.1',
    storeConfig: {
        whitelist: whitelist,
        blacklist: blacklist,
    },
    cacheType : {
        REDUCERVERSION: 'HF:apidoc-reducerversion'
    }
};
