/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as field from '~api/field';
import ActionType from '~constants/action-type';

export const requestFieldList = createAction(ActionType.FIELD_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'fields' }));
export const recevieFieldList = createAction(ActionType.FIELD_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'fields' }));

export const delField = createAction(ActionType.FIELD_DEL, (payload) => payload,
    () => ({ subreddit: 'fields' }));
export const updateAddField = createAction(ActionType.FIELD_UPDATE_ADD, (payload) => payload,
    () => ({ subreddit: 'fields' }));

/**
 * 接口请求
 */
export const fetchFieldCheckList = createAsynAction( field.getFields, requestFieldList, recevieFieldList );
export const fetchUpdateAddField = createAsynAction( field.updateAddField, null, updateAddField );
export const fetchDelField = createAsynAction( field.delField, null, delField );