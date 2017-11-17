/**
 * Created by Cray on 2017/7/20.
 */

const ActionType = {
    /** project **/
    PJ_RQ_LIST: 'request project list',
    PJ_RC_LIST: 'receive project list',
    PJ_RQ_DEL: 'request delete project',
    PJ_RC_DEL: 'receive delete project',
    PJ_UPDATE_ADD: 'update add project',
    PJ_ADD_COOPER: 'add cooper project',
    PJ_DEL_COOPER: 'del cooper project',
    PJ_IMP_APIVIEW: 'import project apiview',

    /** admin **/
    ADMIN_RQ_LIST: 'request admins list',
    ADMIN_RC_LIST: 'receive admins list',
    ADMIN_DEL: 'delete admin',
    ADMIN_REG: 'register admin',
    ADMIN_UPDATE_ADD: 'update add admin',  //修改管理员用户名和密码
    ADMIN_UPDATE_SUPER: 'update super admin',  //更新超级管理员密码

    /** interface **/
    IF_RQ_LIST: 'request interface list',
    IF_RC_LIST: 'receive interface list',
    IF_DEL: 'delete interface',
    IF_UPDATE_ADD: 'update add interface',

     /** itemplete **/
     ITEMP_RQ_LIST: 'request itemplete list',
     ITEMP_RC_LIST: 'receive itemplete list',
     ITEMP_DEL: 'delete itemplete',
     ITEMP_UPDATE_ADD: 'update add itemplete',

    /** state code **/
    SC_RQ_LIST: 'request state-code list',
    SC_RC_LIST: 'receive state-code list',
    SC_DEL: 'delete state-code',
    SC_UPDATE_ADD: 'update add state-code',

    /** database **/
    DB_RQ_LIST: 'request database list',
    DB_RC_LIST: 'receive database list',
    DB_DEL: 'delete database',
    DB_UPDATE_ADD: 'update add database',

    /** field **/
    FIELD_RQ_LIST: 'request field list',
    FIELD_RC_LIST: 'receive field list',
    FIELD_DEL: 'delete field',
    FIELD_UPDATE_ADD: 'update add field',

    /** group **/
    GROUP_RQ_LIST: 'request group list',
    GROUP_RC_LIST: 'receive group list',
    GROUP_RQ_DEL: 'request delete group',
    GROUP_RC_DEL: 'receive delete group',
    GROUP_UPDATE_ADD: 'update add group',

    /** test env **/
    TE_RQ_LIST: 'request test-env list',
    TE_RC_LIST: 'receive test-env list',
    TE_DEL: 'delete test-env',
    TE_UPDATE_ADD: 'update add test-env',

    /** user **/
    USER_RQ_LIST: 'request users list',
    USER_RC_LIST: 'receive users list',
    USER_DEL: 'delete user',
    USER_REG: 'register user',
    USER_UPDATE: 'update user',
    USER_RESET: 'reset user',
    USER_LOGIN: 'login user',
    USER_LOGOUT: 'logout user',
    USER_SEARCH: 'search user',
    USER_MULTIPLE: 'get multiple user',

    INVALIDATE_SUBREDDIT: 'invalidate_subreddit',


    /**** global *****/
    GROUP_SEARCH: 'group search',
    GROUP_RESIZE: 'group_resize',
    GROUP_LISTID: 'group_listId',
    GROUP_CLEAR: 'group_clear',

    INTERFACE_DETAIL:'interface detail',
};

export default ActionType;