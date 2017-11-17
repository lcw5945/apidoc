/**
 * Created by Cray on 2017/7/7.
 */

import {createStore, applyMiddleware, compose} from 'redux'
import {persistStore, autoRehydrate, getStoredState} from 'redux-persist'
import {reduxRouterMiddleware, thunkMiddleware, loggerMiddleware} from '../middleware';
import rootReducer from '../reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import DevTools from '~components/devtools'
import * as RehydrationServices from '../service/rehydration-services'

const configStroe = function () {

    const middleware = [thunkMiddleware, reduxRouterMiddleware, loggerMiddleware];
    const initialState = RehydrationServices.getStoredState();

    if(process.env.NODE_ENV === 'development'){
        const enhancers = compose(
            applyMiddleware(...middleware),
            DevTools.instrument(),
            autoRehydrate()
        );

        return createStore(rootReducer, initialState, enhancers);
    }else{

        const enhancers = composeWithDevTools(
            applyMiddleware(...middleware),
            autoRehydrate()
        );

        return createStore(rootReducer, initialState, enhancers);
    }
}

const store = configStroe();

RehydrationServices.updateReducers(store);

export default store;
