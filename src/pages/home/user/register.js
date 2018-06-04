/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as userActions from '~actions/user';
import  MainNav  from '~components/common/MainNav';
import  RegisterContainer  from '~containers/user/RegisterContainer';

// @connect(
//     state => state,
//     dispatch => bindActionCreators({...globalActions, ...userActions}, dispatch)
// )
class RegisterUser extends React.Component {

    render() {
        return (
            <div>
                <MainNav/>
                <RegisterContainer { ...this.props }/>
            </div>
        );
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...userActions}, dispatch)
)(RegisterUser)
