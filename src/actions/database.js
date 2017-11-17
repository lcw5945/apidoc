/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as database from '~api/database';
import ActionType from '~constants/action-type';

export const requestDatabaseList = createAction(ActionType.DB_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'databases' }));
export const recevieDatabaseList = createAction(ActionType.DB_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'databases' }));

export const delDatabase = createAction(ActionType.DB_DEL, (payload) => payload,
    () => ({ subreddit: 'databases' }));
export const updateAddDatabase = createAction(ActionType.DB_UPDATE_ADD, (payload) => payload,
    () => ({ subreddit: 'databases' }));

/**
 * 接口请求
 */
export const fetchDatabaseCheckList = createAsynAction( database.getDatabases, requestDatabaseList, recevieDatabaseList );
export const fetchUpdateAddDatabase = createAsynAction( database.updateAddDatabase, null, updateAddDatabase );
export const fetchDatabase = createAsynAction( database.delDatabase, null, delDatabase );