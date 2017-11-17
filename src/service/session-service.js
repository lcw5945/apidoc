/**
 * Created by Cray on 2017/8/24.
 */
import store from '../store'
import * as userActions from '../actions/user'

export default {
    logout(){
        store.dispatch(userActions.logoutUser({ res: { token: '' }}))
    }
}