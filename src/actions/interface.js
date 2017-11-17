/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as interfaces from '~api/interface';
import ActionType from '~constants/action-type';

export const requestInterfaceList = createAction(ActionType.IF_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'interfaces' }));
export const recevieInterfaceList = createAction(ActionType.IF_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'interfaces' }));

export const delInterface = createAction(ActionType.IF_DEL, (payload) => payload,
    () => ({ subreddit: 'interfaces' }));
export const updateAddInterface = createAction(ActionType.IF_UPDATE_ADD, (payload) => payload,
    () => ({ subreddit: 'interfaces' }));

/**
 * 接口请求
 */
export const fetchInterfaceCheckList = createAsynAction( interfaces.getInterfaces, requestInterfaceList, recevieInterfaceList );
export const fetchUpdateAddInterface = createAsynAction( interfaces.updateAddInterfaces, null, updateAddInterface );
export const fetchDelInterface = createAsynAction( interfaces.delInterfaces, null, delInterface );
