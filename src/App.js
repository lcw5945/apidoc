/** less **/
import './less/app.less';

/** js **/
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {routes} from './routes';
import {syncHistoryWithStore} from 'react-router-redux';
import history from './routes/history';
import store from './store';
import Local from './utils/local';
import {BrowserRouter as Router} from 'react-router-dom'
import * as globalActions from './actions/global';
import * as userActions from './actions/user';

const hs = syncHistoryWithStore(history, store)
hs.listen(function (location) {
    return location
});

// @connect(
//     state => state,
//     dispatch => bindActionCreators({...globalActions, ...userActions}, dispatch)
// )
 class App extends React.Component {

    /**
     * 组件将要创建
     * 从 redux中获取userinfo
     */
    componentWillMount() {
        const userInfo = this.props.user;
        if (userInfo) {
           this.props.loginUser(userInfo)
        }
    }

    /**
     * 组件渲染完成
     */
    componentDidMount() {
    }

    /**
     * 开始渲染组件
     * @returns {XML}
     */
    render() {
        return  <Router>{routes}</Router>;
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...userActions}, dispatch)
)(App)