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
import  ApiPtestContainer  from '~containers/project/api/ApiPtestContainer';
import Utils from '~utils';
import {paramsFormat} from '~common/http';



class ApiTests extends React.Component {

    constructor(props) {
        super(props);
        this.queryData = null;
    }

    componentWillMount() {
        this.queryData = Utils.parseUrlToData(this.props.location.search);
        if (!this.props.entity['interfaces']) {
            this.props.fetchInterfaceCheckList(paramsFormat({projectId: this.queryData.projectId}));
        }
        if (!this.props.entity['testenv']) {
            this.props.fetchTestEnvCheckList(paramsFormat({}));
        }
    }

    render() {
        return (
            <div>
                <MainNav/>
                <SubNav subNavType='childList'/>
                <ApiPtestContainer {...this.props}/>
            </div>
        );
    }
}


export default  connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...interfaceActions, ...testenvActions}, dispatch)
)(ApiTests)