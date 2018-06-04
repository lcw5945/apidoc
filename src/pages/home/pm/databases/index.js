/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import { paramsFormat } from '~common/http';
import * as databaseActions from '~actions/database';
import  SubNav  from '~components/common/SubNav';
import  MainNav  from '~components/common/MainNav';
import  DatabaseContainer  from '~containers/home/DatabaseContainer';


class Databases extends React.Component {

    componentWillMount() {
        if (!this.props.entity['databases'] || this.props.entity['databases'].didInvalidate) {
            this.props.fetchDatabaseCheckList(paramsFormat({}));
        }
    }

    componentDidMount() {
    }

    render() {
        return (
                <div>
                    <MainNav/>
                    <SubNav { ...this.props } subNavType='homeList'/>
                    <DatabaseContainer { ...this.props }/>
                </div>
            )
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...databaseActions}, dispatch)
)(Databases)