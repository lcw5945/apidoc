/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as stateActions from '~actions/statecode';
import * as groupActions from '~actions/group';
import  MainNav  from '~components/common/MainNav';
import  SubNav  from '~components/common/SubNav';
import  CodeEditContainer  from '~containers/project/code/CodeEditContainer';
import Utils from '~utils';
import {paramsFormat} from "~common/http";



class ApiEdit extends React.Component {
    constructor(props) {
        super(props);
        this.queryData = null;
    }

    componentWillMount() {
        this.queryData = Utils.parseUrlToData(this.props.location.search);
        console.log()
        if (!this.props.entity['groups'] || !this.props.entity['groups'][this.queryData.projectId]) {
            this.props.fetchGroupCheckList(paramsFormat({projectId: this.queryData.projectId}));
        }
        if (!this.props.entity['interfaces'] || !this.props.entity['interfaces'][this.queryData.projectId]) {
            this.props.fetchInterfaceCheckList(paramsFormat({projectId: this.queryData.projectId}));
        }
    }

    componentDidMount() {
    }

    render() {
        return (
            <div key={this.props.location.pathname}>
                <MainNav/>
                <SubNav subNavType='childList'/>
                <CodeEditContainer { ...this.props } />
                编辑
            </div>
        );
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions,...stateActions,...groupActions}, dispatch)
)(ApiEdit)