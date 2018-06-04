/**
 * Created by lichunwei on 2017/7/21.
 */

import { message, notification } from 'antd'
import ActionType from '~constants/action-type';
import * as RehydrationServices from '../service/rehydration-services'
import SessionService  from '../service/session-service'

export const hasResponseError = function (data) {
    if (!data) {
        message.error(`数据返回错误, [${data}]`);
        return true
    }

    if (typeof data !== 'object') {
        try {
            data = JSON.parse(`${data}`);
        } catch (e) {
            message.error(`非法的响应数据格式，请联系管理员！[${data}]`);
            return true
        }
    }

    return String(data.code) !== '200';
};

/**
 * 捕获错误
 * @param error
 */
export const catchError = function (error) {
    switch (parseInt(error.status)) {
        case 401:
        {
            logOut();
            break;
        }
        case 208:
        {
            break;
        }
        default: {

            break;
        }
    }

    message.error(error.msg);
};

/**
 * 捕获action
 * @param action
 */
export const catchAction = (action, res) => {
    const type = action().type;
    switch (type){
        case ActionType.USER_RESET :
            openNotificationWithIcon('success', '重置密码', '重置密码成功，密码：'+res.password);
            break;
        case ActionType.IF_UPDATE_ADD :
        case ActionType.PJ_ADD_COOPER :
            break;
        case ActionType.ITEMP_UPDATE_ADD :
        case ActionType.SC_UPDATE_ADD :
        case ActionType.FIELD_UPDATE_ADD :
        case ActionType.GROUP_UPDATE_ADD :
            openNotificationWithIcon('success', '操作成功');
            break;
        case ActionType.IF_DEL :
        case ActionType.ITEMP_DEL :
        case ActionType.SC_DEL :
        case ActionType.FIELD_DEL :
        case ActionType.PJ_DEL_COOPER :
        case ActionType.GROUP_RC_DEL :
            openNotificationWithIcon('success', '删除成功');
            break;
        case ActionType.LOGIN_TEST :
            openNotificationWithIcon('success', '登录成功');
            break;
        default:
            break
    }
}

/**
 * 退出
 */
export const logOut = () => {
    SessionService.logout();
};

/**
 * 格式化参数
 * @param params
 * @returns {*|{}}
 */
export const paramsFormat = (params) => {
    let result = params || {};
    const userInfo = RehydrationServices.getStoredState('user');
    if (userInfo) {
        result.token = userInfo.token;
    }
    return result;
};

const openNotificationWithIcon = (type, title, des) => {
    notification[type]({
        message: title,
        description: des
    });
};

