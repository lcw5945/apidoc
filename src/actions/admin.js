/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as admin from '~api/admin';
import ActionType from '~constants/action-type';

export const requestAdminList = createAction(ActionType.ADMIN_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'admins' }));
export const recevieAdminList = createAction(ActionType.ADMIN_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'admins' }));
export const delAdmin = createAction(ActionType.ADMIN_DEL, (payload) => payload,
    () => ({ subreddit: 'admins' }));

export const registerAdmin = createAction(ActionType.ADMIN_REG);
export const updateAddAdmin = createAction(ActionType.ADMIN_UPDATE_ADD); //修改管理员用户名和密码
export const updateSuperAdmin = createAction(ActionType.ADMIN_UPDATE_SUPER); //更新超级管理员密码

/**
 * 接口请求
 */
export const fetchAdminCheckList = createAsynAction( admin.getAdmins, requestAdminList, recevieAdminList );
export const fetchDelAdmin  = createAsynAction( admin.delAdmin, null, delAdmin );
export const fetchRegAdmin  = createAsynAction( admin.register, null, registerAdmin );
export const fetchUpdateAddAdmin = createAsynAction( admin.updateAddAdmin, null, updateAddAdmin );
export const fetchUpdateSuperAdmin = createAsynAction( admin.updateSuperAdmin, null, updateSuperAdmin );