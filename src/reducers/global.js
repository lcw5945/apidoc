/**
 * Created by Cray on 2017/6/7.
 */

import { handleActions } from 'redux-actions'
import ActionType from '../constants/action-type';


export const global = handleActions({
    [ActionType.GROUP_SEARCH] (state, action) {
        return Object.assign({}, state, {
            "groupCmp": combination(state.groupCmp, action)
        });
    },
    [ActionType.GROUP_RESIZE] (state, action) {
        return Object.assign({}, state, {
            "groupCmp": combination(state.groupCmp, action)
        })
    },
    [ActionType.GROUP_LISTID] (state, action) {
        return Object.assign({}, state, {
            "groupCmp": combination(state.groupCmp, action)
        })
    },
    [ActionType.GROUP_CLEAR] (state, action) {
        let re = {groupCmp: {
            searchConent: '',
            width: '',
            listId : '-1'
        }};
        return Object.assign({}, state, re)
    },
    [ActionType.INTERFACE_DETAIL] (state, action) {
        return Object.assign({}, state, {
            "interfaceCmp": combination(state.interfaceCmp, action)
        })
    }
}, {
    groupCmp: {
        searchConent: '',
        width: '',
        listId : '-1'
    },
    interfaceCmp:{
        detail:{}
    }
});

/**
 * 组合
 * @param state
 * @param action
 * @returns {*}
 */
const combination = (state, action) => {
    return Object.assign({}, state, {
        [action.meta.subreddit]: action.payload
    });
}

