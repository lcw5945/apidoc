/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as interfaceActions from '~actions/interface';
import * as testenvActions from '~actions/testenv';
import  MainNav  from '~components/common/MainNav';
import  SubNav  from '~components/common/SubNav';
import  ApiTestContainer  from '~containers/project/api/ApiTestContainer';
import {paramsFormat} from '~common/http';
import Utils from '~utils'

class ApiTests extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            queryData: Utils.parseUrlToData(this.props.location.search) || {}
        }
    }

    componentWillMount() {
        if (!this.props.entity['testenv'] || this.props.entity['testenv'].didInvalidate) {
            this.props.fetchTestEnvCheckList(paramsFormat({projectid: this.state.queryData.projectId}));
        }
    }

    render() {
        return (
            <div>
                <MainNav/>
                <SubNav subNavType='childList'/>
                <ApiTestContainer {...this.props}/>
            </div>
        );
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...interfaceActions, ...testenvActions}, dispatch)
)(ApiTests)