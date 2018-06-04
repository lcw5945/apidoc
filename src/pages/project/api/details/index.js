/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as interfaceActions from '~actions/interface';
import * as groupActions from '~actions/group';
import  MainNav  from '~components/common/MainNav';
import  SubNav  from '~components/common/SubNav';
import  ApiDetailContainer  from '~containers/project/api/ApiDetailContainer';
import Utils from '~utils';
import {paramsFormat} from '~common/http';


class ApiDetails extends React.Component {

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
        }else{
            let apiId = this.queryData.apiId
            let pjData = this.props.entity['interfaces'][this.queryData.projectId]
            let hasAry = pjData.items.filter((item) => {return item._id == apiId})
            if(hasAry.length == 0){
                this.props.fetchInterfaceCheckList(paramsFormat({projectId: this.queryData.projectId}));
            }
        }
    }

    render() {
        return (
            <div>
                <MainNav/>
                <SubNav subNavType='childList'/>
                <ApiDetailContainer {...this.props}/>
            </div>
        );
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...interfaceActions, ...groupActions}, dispatch)
)(ApiDetails)