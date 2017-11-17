/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as itemplete from '~api/itemplete';
import ActionType from '~constants/action-type';

export const requestITempleteList = createAction(ActionType.ITEMP_RQ_LIST, (payload) => payload,
    () => ({ subreddit: 'itemplete' }));
export const recevieITempleteList = createAction(ActionType.ITEMP_RC_LIST, (payload) => payload,
    () => ({ subreddit: 'itemplete' }));

export const delITemplete = createAction(ActionType.ITEMP_DEL, (payload) => payload,
    () => ({ subreddit: 'itemplete' }));
export const updateAddITemplete = createAction(ActionType.ITEMP_UPDATE_ADD, (payload) => payload,
    () => ({ subreddit: 'itemplete' }));


/**
 * 接口请求
 */
export const fetchITempleteCheckList = createAsynAction( itemplete.getITempletes, requestITempleteList, recevieITempleteList );
export const fetchUpdateAddITemplete = createAsynAction( itemplete.updateAddITemplete, null, updateAddITemplete );
export const fetchDelITemplete = createAsynAction( itemplete.delITemplete, null, delITemplete );