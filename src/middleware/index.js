/**
 * Created by Cray on 2017/7/7.
 */

import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk';
import history from '../routes/history';

const reduxRouterMiddleware = routerMiddleware(history);
const loggerMiddleware = createLogger()

export {
    reduxRouterMiddleware,
    thunkMiddleware,
    loggerMiddleware,
}
