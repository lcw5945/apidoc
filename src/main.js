/**
 * Created by Cray on 2017/7/10.
 */
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {AppContainer} from 'react-hot-loader'
import App from './App'
import store from './store'
import sockertService from './service/socket-service'
import registerServiceWorker from './service/register-service-worker'

const render = Component =>
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
            </Provider>
        </AppContainer>,
        document.getElementById('root')
    );

render(App);
// registerServiceWorker();
sockertService(store)


if (__DEV && module.hot) {
    module.hot.accept('./App', () => {
        render(App)
    });
}