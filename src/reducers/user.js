/**
 * Created by Cray on 2017/7/25.
 */
import { handleActions } from 'redux-actions'
import ActionType from '~constants/action-type';

export const user = handleActions({
    [ActionType.USER_LOGIN] (state, action) {
        if(action.payload["res"]){
            const { res } = action.payload;
            if (!res) {
                return { ...state }
            }
            return { ...state, ...res }
        }
        return { ...state, ...action.payload }
    },
    [ActionType.USER_AUTOLOGIN] (state, action) {
        if(action.payload["res"]){
            const { res } = action.payload;
            if (!res) {
                return { ...state }
            }
            return { ...state, ...res }
        }
        return { ...state, ...action.payload }
    },
    [ActionType.USER_LOGOUT] (state, action) {
        if(action.payload["res"]){
            const { res } = action.payload;
            if (!res) {
                return { ...state }
            }
            return { ...state, ...res }
        }
        return { ...state, ...action.payload }
    }
}, {
    userId: '',
    username: '',
    token: '',
    auth: 0
});