/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as userActions from '~actions/user';
import {paramsFormat} from '~common/http';
import  MainNav  from '~components/common/MainNav';
import  ManagerContainer  from '~containers/user/ManagerContainer';

 class Manager extends React.Component {
    componentWillMount() {
        const {auth} = this.props.user;
        if (auth > 0 && (!this.props.entity['users'] || this.props.entity['users']['didInvalidate'])) {
            this.props.fetchUserCheckList(paramsFormat({}));
        }
    }

    render() {
        return (
            <div>
                <MainNav/>
                <ManagerContainer { ...this.props }/>
            </div>
        );
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...userActions}, dispatch)
)(Manager)
