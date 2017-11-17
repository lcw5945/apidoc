/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as project from '~api/project';
import ActionType from '~constants/action-type';

export const requestProjectList = createAction(ActionType.PJ_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'projects' }));
export const recevieProjectList = createAction(ActionType.PJ_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'projects' }));

export const requestDelProject = createAction(ActionType.PJ_RQ_DEL, (payload) => payload,
    () => ({ subreddit: 'projects' }));

export const recevieDelProject = createAction(ActionType.PJ_RC_DEL, (payload) => payload,
    () => ({ subreddit: 'projects' }));

export const updateAddProject = createAction(ActionType.PJ_UPDATE_ADD, (payload) => payload,
    () => ({ subreddit: 'projects' }));

export const addCooper = createAction(ActionType.PJ_ADD_COOPER, (payload) => payload,
    () => ({ subreddit: 'projects' }));

export const delCooper = createAction(ActionType.PJ_DEL_COOPER, (payload) => payload,
    () => ({ subreddit: 'projects' }));

export const importPjFromApiView = createAction(ActionType.PJ_IMP_APIVIEW, (payload) => payload,
    () => ({ subreddit: 'projects' }));
export const getPjFromApiView = createAction(ActionType.PJ_IMP_APIVIEW, (payload) => payload,
    () => ({ subreddit: 'projects' }));

/***
 * 接口请求
 */
export const fetchProjectCheckList = createAsynAction( project.getProjects, requestProjectList, recevieProjectList );
export const fetchDelProject = createAsynAction( project.delProject, requestDelProject, recevieDelProject );
export const fetchUpdateAddProject = createAsynAction( project.updateAddProject, null, updateAddProject );
export const fetchAddCooper = createAsynAction( project.addCooper, null, addCooper );
export const fetchDelCooper = createAsynAction( project.delCooper, null, delCooper );
export const fetchImportPjFromApiView = createAsynAction( project.importPjFromApiView, null, importPjFromApiView );
export const fetchGetPjFromApiView = createAsynAction( project.getPjFromApiView, null, getPjFromApiView );
