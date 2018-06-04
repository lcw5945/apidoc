/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as user from '~api/user';
import ActionType from '~constants/action-type';

export const requestUserList = createAction(ActionType.USER_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'users' }));
export const recevieUserList = createAction(ActionType.USER_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'users' }));

export const delUser = createAction(ActionType.USER_DEL, (payload) => payload,
    () => ({ subreddit: 'users' }));
export const searchUser = createAction(ActionType.USER_SEARCH, (payload) => payload,
    () => ({ subreddit: 'users' }));

export const regUser = createAction(ActionType.USER_REG);
export const updateUser = createAction(ActionType.USER_UPDATE);
export const resetUser = createAction(ActionType.USER_RESET);
export const loginUser = createAction(ActionType.USER_LOGIN);
export const logoutUser = createAction(ActionType.USER_LOGOUT);
export const getMulUser = createAction(ActionType.USER_MULTIPLE);
export const autoLoginUser = createAction(ActionType.USER_AUTOLOGIN);

/**
 * 接口请求
 */
export const fetchUserCheckList = createAsynAction( user.getRegistUsers, requestUserList, recevieUserList );
export const fetchDelUser = createAsynAction( user.delRegistUser, null, delUser );
export const fetchUpdateUser = createAsynAction( user.updateUser, null, updateUser );
export const fetchResetUser = createAsynAction( user.resetRegistUser, null, resetUser );
export const fetchSearchUser = createAsynAction( user.searchRegistUsers, null, searchUser );
export const fetchRegUser = createAsynAction( user.register, null, regUser );
export const fetchLoginUser = createAsynAction( user.login, null, loginUser );
export const fetchAutoLoginUser = createAsynAction( user.autologin, null, autoLoginUser );
export const fetchLogoutUser = createAsynAction( user.logout, null, logoutUser );
export const fetchMulUser = createAsynAction( user.getMulUser, null, getMulUser );
