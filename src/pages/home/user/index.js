/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as userActions from '~actions/user';
import  MainNav  from '~components/common/MainNav';
import  UserContainer  from '~containers/user/UserContainer';

@connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...userActions}, dispatch)
)
export default class User extends React.Component {

    render() {
        return (
            <div>
                <MainNav/>
                <UserContainer { ...this.props }/>
            </div>
        );
    }
}
