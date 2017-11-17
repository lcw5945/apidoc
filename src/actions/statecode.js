/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as statecode from '~api/statecode';
import ActionType from '~constants/action-type';

export const requestStateCodeList = createAction(ActionType.SC_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'statecodes' }));
export const recevieStateCodeList = createAction(ActionType.SC_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'statecodes' }));

export const delStateCode = createAction(ActionType.SC_DEL, (payload) => payload,
    () => ({ subreddit: 'statecodes' }));
export const updateAddStateCode = createAction(ActionType.SC_UPDATE_ADD, (payload) => payload,
    () => ({ subreddit: 'statecodes' }));

/**
 * 接口请求
 */
export const fetchStateCodeCheckList = createAsynAction( statecode.getStateCodes, requestStateCodeList, recevieStateCodeList );
export const fetchUpdateAddStateCode = createAsynAction( statecode.updateAddStateCode, null, updateAddStateCode );
export const fetchDelStateCode = createAsynAction( statecode.delStateCode, null, delStateCode );