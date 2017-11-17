/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as testenv from '~api/testenv';
import ActionType from '~constants/action-type';

export const requestTestEnvList = createAction(ActionType.TE_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'testenv' }));
export const recevieTestEnvList = createAction(ActionType.TE_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'testenv' }));

export const delTestEnv = createAction(ActionType.TE_DEL, (payload) => payload,
    () => ({ subreddit: 'testenv' }));
export const updateAddTestEnv = createAction(ActionType.TE_UPDATE_ADD, (payload) => payload,
    () => ({ subreddit: 'testenv' }));


/**
 * 接口请求
 */
export const fetchTestEnvCheckList = createAsynAction( testenv.getTestEnvs, requestTestEnvList, recevieTestEnvList );
export const fetchUpdateAddTestEnv = createAsynAction( testenv.updateAddTestEnv, null, updateAddTestEnv );
export const fetchTestEnv = createAsynAction( testenv.delTestEnv, null, delTestEnv );