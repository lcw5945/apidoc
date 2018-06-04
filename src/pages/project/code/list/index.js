/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Utils from '~utils';
import {paramsFormat} from '~common/http';
import * as globalActions from '~actions/global';
import * as groupActions from '~actions/group';
import * as statecodeActions from '~actions/statecode';
import * as projectActions from '~actions/project';
import  SubNav  from '~components/common/SubNav';
import  MainNav  from '~components/common/MainNav';
import  CodeContainer  from '~containers/project/code/CodeContainer';

class StateCode extends React.Component {
    constructor(props) {
        super(props);
        this.queryData = null;
    }
    componentWillMount() {
        this.queryData = Utils.parseUrlToData(this.props.location.search)
        let projectId = this.queryData.projectId
        let scData  = this.props.entity['statecodes']
        if (!scData || !scData[projectId] || scData[projectId].didInvalidate || (Date.now() - scData[projectId].lastUpdated > 10 * 60 * 1000)) {
            this.props.fetchStateCodeCheckList(paramsFormat({projectId: projectId}));
        }
    }

    render() {
        return (
            <div key={this.props.location.pathname}>
                <MainNav/>
                <SubNav subNavType='childList'  {...this.props}/>
                <CodeContainer {...this.props}/>
            </div>
        );
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...statecodeActions, ...groupActions, ...projectActions}, dispatch)
)(StateCode)