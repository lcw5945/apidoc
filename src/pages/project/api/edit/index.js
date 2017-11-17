/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as interfaceActions from '~actions/interface';
import * as groupActions from '~actions/group';
import * as itemplateActions from '~actions/itemplete';
import  MainNav  from '~components/common/MainNav';
import  SubNav  from '~components/common/SubNav';
import  ApiEditContainer  from '~containers/project/api/ApiEditContainer';
import Utils from '~utils';
import {paramsFormat} from "~common/http";


@connect(
    state => state,
    dispatch => bindActionCreators({...globalActions,...interfaceActions,...groupActions,...itemplateActions}, dispatch)
)
export default class ApiEdit extends React.Component {
    constructor(props) {
        super(props);
        this.queryData = null;
    }

    componentWillMount() {
        this.queryData = Utils.parseUrlToData(this.props.location.search);

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
                <ApiEditContainer { ...this.props } />
                编辑
            </div>
        );
    }
}