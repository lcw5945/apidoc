/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as interfaceActions from '~actions/interface';
import  MainNav  from '~components/common/MainNav';
import  SubNav  from '~components/common/SubNav';
import  CodeDetailContainer  from '~containers/project/code/CodeDetailContainer';
import Utils from '~utils';
import {paramsFormat} from '~common/http';



@connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...interfaceActions}, dispatch)
)
export default class CodeDetails extends React.Component {

    constructor(props) {
        super(props);
        this.queryData = null;
    }

    componentWillMount() {
        this.queryData = Utils.parseUrlToData(this.props.location.search);
        if (!this.props.entity['interfaces'] || !this.props.entity['interfaces'][this.queryData.projectId]) {
            this.props.fetchInterfaceCheckList(paramsFormat({projectId: this.queryData.projectId}));
        }
    }

    render() {
        return (
            <div>
                <MainNav/>
                <SubNav subNavType='childList'/>
                <CodeDetailContainer {...this.props}/>
            </div>
        );
    }
}