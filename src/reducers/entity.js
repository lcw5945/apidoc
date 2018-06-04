/**
 * Created by lichunwei on 2017/7/27.
 */
import ActionType from '../constants/action-type';
import _ from 'lodash';

/**
 * reduce处理数据
 * @param state
 * @param action
 * @returns {*}
 */
function posts(state = {
        isFetching: false,
        didInvalidate: false,
        items: []
    },
    action) {
    switch (action.type) {
        case ActionType.INVALIDATE_SUBREDDIT:
            return Object.assign({}, state, {
                didInvalidate: true
            })
        case ActionType.PJ_RQ_LIST:
        case ActionType.IF_RQ_LIST:
        case ActionType.DB_RQ_LIST:
        case ActionType.SC_RQ_LIST:
        case ActionType.TE_RQ_LIST:
        case ActionType.ITEMP_RQ_LIST:
        case ActionType.GROUP_RQ_LIST:
        case ActionType.USER_RQ_LIST:
        case ActionType.FIELD_RQ_LIST:
        case ActionType.GROUP_RQ_DEL:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        case ActionType.PJ_RC_LIST:
        case ActionType.IF_RC_LIST:
        case ActionType.DB_RC_LIST:
        case ActionType.SC_RC_LIST:
        case ActionType.TE_RC_LIST:
        case ActionType.ITEMP_RC_LIST:
        case ActionType.USER_RC_LIST:
        case ActionType.FIELD_RC_LIST:
        case ActionType.GROUP_RC_LIST:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.payload.res.details,
                lastUpdated: action.payload.receivedAt
            })
        case ActionType.PJ_UPDATE_ADD:
        case ActionType.IF_UPDATE_ADD:
        case ActionType.SC_UPDATE_ADD:
        case ActionType.TE_UPDATE_ADD:
        case ActionType.ITEMP_UPDATE_ADD:
        case ActionType.FIELD_UPDATE_ADD:
        case ActionType.GROUP_UPDATE_ADD:
        case ActionType.DB_UPDATE_ADD:
            {
                let { req, res } = action.payload;
                let items = state.items;
                req.lastTime = action.payload.receivedAt

                if (req.hasOwnProperty('id') && req.id !== "") {
                    _.forOwn(items, function(value, key) {
                        if (value._id === req.id) {
                            items[key] = Object.assign({}, value, _.omit(req, ['token', "id"]))
                            return false;
                        }
                    });
                    if (ActionType.GROUP_UPDATE_ADD == action.type || ActionType.FIELD_UPDATE_ADD == action.type) {
                        state.items = _.orderBy(items, ['lastTime'], ['desc']);
                    }
                    return Object.assign({}, state, {
                        lastUpdated: action.payload.receivedAt
                    })
                } else {
                    items.push(res);
                    //有疑问，接口创建分组时应使用lastTime排序，待确认
                    if (ActionType.IF_UPDATE_ADD == action.type) {
                        state.items = _.sortBy(items, [function(o) { return o.update; }]);
                    } else {
                        state.items = _.sortBy(items, [function(o) { return o.lastTime; }]);
                    }
                    state.items.reverse()
                    return Object.assign({}, state, {
                        lastUpdated: action.payload.receivedAt
                    })
                }
            }
        case ActionType.DB_DEL:
        case ActionType.SC_DEL:
        case ActionType.TE_DEL:
        case ActionType.ITEMP_DEL:
        case ActionType.USER_DEL:
        case ActionType.FIELD_DEL:
        case ActionType.IF_DEL:
            {
                let { req } = action.payload;
                let id = req['id'] || req['userId'];
                if (id) {
                    _.remove(state.items, (value) => {
                        return value._id === id;
                    });

                    return Object.assign({}, state, {
                        lastUpdated: action.payload.receivedAt
                    })
                }
                return state
            }

        case ActionType.PJ_ADD_COOPER:
            {
                let { req } = action.payload;
                if (req.hasOwnProperty('projectId')) {
                    _.forOwn(state.items, function(value, key) {
                        if (value._id === req.projectId) {
                            if (_.some(state.items[key].cooperGroup, { userId: req.useId })) {
                                _.forEach(state.items[key].cooperGroup, function(item, key) {
                                    if (item.userId == req.useId) {
                                        item.authority = req.authority || 0
                                    }
                                });
                            } else {
                                state.items[key].cooperGroup.push({
                                    userId: req.useId,
                                    username: req.username,
                                    authority: req.authority
                                });
                            }

                            return false;
                        }
                    });

                    return Object.assign({}, state, {
                        lastUpdated: action.payload.receivedAt
                    })
                }
                return state
            }

        case ActionType.PJ_DEL_COOPER:
            {
                let { req } = action.payload;
                if (req.hasOwnProperty('projectId')) {
                    _.forOwn(state.items, function(value, key) {
                        if (value._id === req.projectId) {
                            _.remove(state.items[key].cooperGroup, (value) => {
                                return value.userId === req.useId;
                            });
                            return false;
                        }
                    });

                    return Object.assign({}, state, {
                        lastUpdated: action.payload.receivedAt
                    })
                }
                return state
            }
        default:
            return state
    }
}

function postItems(state = {}, action) {
    let id = '';
    switch (action.meta.subreddit) {
        case "databases":
            id = action.payload.req.databaseId;
            break;
        case "projects":
            id = action.payload.req.projectId;
            break;
        case "interfaces":
            id = action.payload.req.projectId;
            break;
        case "fields":
            id = action.payload.req.databaseId;
            break;
        case "statecodes":
            id = action.payload.req.projectId;
            break;
        case "groups":
            id = action.payload.req.databaseId || action.payload.req.projectId;
            break;
        default:
            id = 'default'
            break
    }
    return Object.assign({}, state, {
        [id]: posts(state[id], action)
    })
}

/**
 * 删除分组
 * @param state
 * @param action
 */
function delGroup(state = {}, action) {
    let id = action.payload.req.databaseId || action.payload.req.projectId;
    let { req } = action.payload;
    let newState = {}; //新的实体

    newState["groups"] = state["groups"];

    if (!id) return state

    //删除组
    let groupItems = _.remove(newState["groups"][id].items, (value) => {
        return value._id === req.id;
    });

    //更新接口 状态码 数据字典
    let { _id, type, databaseId, projectId } = groupItems[0];

    if (projectId) {
        if (type === "interface") {
            newState["interfaces"] = state["interfaces"]
            _.forOwn(newState["interfaces"][projectId].items, (value, key) => {
                if (value.groupId === _id) {
                    value.groupId = -2;
                }
            })

        } else {
            newState["statecodes"] = state["statecodes"]
            _.remove(newState["statecodes"][projectId].items, (value) => {
                return value.groupId === _id;
            })
        }
    } else {
        newState["fields"] = state["fields"]
        _.remove(newState["fields"][databaseId].items, (value) => {
            return value.groupId === _id;
        })
    }

    return Object.assign({}, state, newState);
}

/**
 * 删除项目
 * @param state
 * @param action
 */
function delProject(state = {}, action) {
    let { req } = action.payload;
    let newState = {};
    newState["projects"] = state["projects"];

    _.remove(newState["projects"].items, (value) => {
        return value._id === req.id;
    });
    newState["projects"].lastUpdated = action.payload.receivedAt

    newState["interfaces"] = state["interfaces"]
    if (newState["interfaces"]) {
        delete newState["interfaces"][req.id]
    }


    newState["statecodes"] = state["statecodes"]
    if (newState["statecodes"]) {
        delete newState["statecodes"][req.id]
    }

    newState["groups"] = state["groups"]
    if (newState["groups"]) {
        delete newState["groups"][req.id]
    }


    return Object.assign({}, state, newState);
}

/**
 * 实体数据库
 * @param state
 * @param action
 * @returns {*}
 */
export const entity = (state = {}, action) => {
    switch (action.type) {
        case ActionType.INVALIDATE_SUBREDDIT:
            /**
             * project
             */
        case ActionType.PJ_RC_LIST:
        case ActionType.PJ_RQ_LIST:
        case ActionType.PJ_UPDATE_ADD:
        case ActionType.PJ_RQ_DEL:
        case ActionType.PJ_ADD_COOPER:
        case ActionType.PJ_DEL_COOPER:
            /**
             * db
             */
        case ActionType.DB_RQ_LIST:
        case ActionType.DB_RC_LIST:
        case ActionType.DB_UPDATE_ADD:
        case ActionType.DB_DEL:
            /**
             * testenv
             */
        case ActionType.TE_RQ_LIST:
        case ActionType.TE_RC_LIST:
        case ActionType.TE_UPDATE_ADD:
        case ActionType.TE_DEL:
            /**
             * users
             */
        case ActionType.USER_RQ_LIST:
        case ActionType.USER_RC_LIST:
        case ActionType.USER_DEL:
            /**
             * admins
             */
        case ActionType.ADMIN_RQ_LIST:
        case ActionType.ADMIN_RC_LIST:
        case ActionType.ADMIN_UPDATE_ADD:
        case ActionType.ADMIN_DEL:
            return Object.assign({}, state, {
                [action.meta.subreddit]: posts(state[action.meta.subreddit], action)
            });

            /**
             * statecode
             */
        case ActionType.SC_RQ_LIST:
        case ActionType.SC_RC_LIST:
        case ActionType.SC_UPDATE_ADD:
        case ActionType.SC_DEL:
            /**
             * interfaces
             */
        case ActionType.IF_RQ_LIST:
        case ActionType.IF_RC_LIST:
        case ActionType.IF_DEL:
        case ActionType.IF_UPDATE_ADD:
            /**
             * itemplete
             */
        case ActionType.ITEMP_RQ_LIST:
        case ActionType.ITEMP_RC_LIST:
        case ActionType.ITEMP_DEL:
        case ActionType.ITEMP_UPDATE_ADD:
            /**
             * groups
             */
        case ActionType.GROUP_RQ_LIST:
        case ActionType.GROUP_RC_LIST:
        case ActionType.GROUP_RQ_DEL:
        case ActionType.GROUP_UPDATE_ADD:
            /**
             * field
             */
        case ActionType.FIELD_RQ_LIST:
        case ActionType.FIELD_RC_LIST:
        case ActionType.FIELD_DEL:
        case ActionType.FIELD_UPDATE_ADD:
            return Object.assign({}, state, {
                [action.meta.subreddit]: postItems(state[action.meta.subreddit], action)
            });

        case ActionType.GROUP_RC_DEL:
            return Object.assign({}, state, delGroup(state, action))
        case ActionType.PJ_RC_DEL:
            return Object.assign({}, state, delProject(state, action))
        default:
            return state

    }
}