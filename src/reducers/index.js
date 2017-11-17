import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux'

import {global} from './global';
import {entity} from './entity'
import {user} from './user';

const rootReducer = combineReducers({
    routing: routerReducer,
    global,
    entity,
    user
});

export default rootReducer;

export const whitelist = [
    'global',
    'entity',
    'user'
];

export const blacklist = [
];
