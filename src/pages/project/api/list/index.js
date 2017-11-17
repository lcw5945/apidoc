/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as interfaceActions from '~actions/interface';
import * as groupActions from '~actions/group';
import * as userActions from '~actions/user';
import * as projectActions from '~actions/project';
import {paramsFormat} from '~common/http';
import Utils from '~utils'
import  SubNav  from '~components/common/SubNav';
import  ApiContainer  from '~containers/project/api/ApiContainer';
import  MainNav  from '~components/common/MainNav';

@connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...interfaceActions, ...groupActions,...userActions,...projectActions}, dispatch)
)
export default class ApiList extends React.Component {

    constructor(props) {
        super(props);
        this.queryData = null;
    }

    componentWillMount() {
        this.queryData = Utils.parseUrlToData(this.props.location.search);

        let projectId = this.queryData.projectId;
        if (!this.props.entity['interfaces'] || !this.props.entity['interfaces'][projectId] || this.props.entity['interfaces'][projectId].didInvalidate) {
            this.props.fetchInterfaceCheckList(paramsFormat({projectId: projectId}));
        }
    }

    render() {
        return (
            <div key={this.props.location.pathname}>
                <MainNav />
                <SubNav subNavType='childList'/>
                <ApiContainer { ...this.props }/>
            </div>
        );
    }
}