/**
 * Created by Cray on 2017/7/20.
 */
import { createAction } from 'redux-actions';
import { createAsynAction } from '~lib/async-action-creater';
import * as common from '~api/common';
import ActionType from '~constants/action-type';

export const loginTestAction = createAction(ActionType.LOGIN_TEST);

/**
 * 接口请求
 */

export const doLoginTest = createAsynAction( common.loginTest, loginTestAction, loginTestAction );
