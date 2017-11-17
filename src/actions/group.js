/**
 * Created by Cray on 2017/8/1.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as group from '~api/group';
import ActionType from '~constants/action-type';

export const requestGroupList = createAction(ActionType.GROUP_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'groups' }));
export const recevieGroupList = createAction(ActionType.GROUP_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'groups' }));

export const requestDelGroup = createAction(ActionType.GROUP_RQ_DEL, (payload) => payload,
    () => ({ subreddit: 'groups' }));
export const recevieDelGroup = createAction(ActionType.GROUP_RC_DEL, (payload) => payload,
    () => ({ subreddit: 'groups' }));
export const updateAddGroup = createAction(ActionType.GROUP_UPDATE_ADD, (payload) => payload,
    () => ({ subreddit: 'groups' }));

/**
 * 接口请求
 */
export const fetchGroupCheckList = createAsynAction( group.getGroups, requestGroupList, recevieGroupList );
export const fetchUpdateAddGroup = createAsynAction( group.updateAddGroup, null, updateAddGroup );
export const fetchDelGroup = createAsynAction( group.delGroup, requestDelGroup, recevieDelGroup );