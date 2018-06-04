/**
 * Created by Cray on 2017/7/20.
 */

import { createAction } from 'redux-actions';
import ActionType from '~constants/action-type';


export const groupSearch = createAction(ActionType.GROUP_SEARCH, (payload) => payload,
    () => ({ subreddit: 'searchConent' }));
export const groupResize = createAction(ActionType.GROUP_RESIZE, (payload) => payload,
    () => ({ subreddit: 'width' }));
export const groupListId = createAction(ActionType.GROUP_LISTID, (payload) => payload,
    () => ({ subreddit: 'listId' }));
export const groupClear = createAction(ActionType.GROUP_CLEAR, (payload) => payload,
    () => ({ subreddit: 'clear' }));


export const interfaceDetail = createAction(ActionType.INTERFACE_DETAIL, (payload) => payload,
    () => ({ subreddit: 'detail' }));

export const projectPageStatus = createAction(ActionType.IF_PAGE_STATUS, (payload) => payload,
    () => ({ subreddit: 'pageStatus' }));