/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as fieldActions from '~actions/field';
import * as groupActions from '~actions/group';
import {paramsFormat} from '~common/http';
import Utils from '~utils'
import  DataBase  from '~containers/database/TableContainer';
import  MainNav  from '~components/common/MainNav';

@connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...fieldActions, ...groupActions}, dispatch)
)
export default class DatabaseList extends React.Component {

    constructor(props) {
        super(props);
        this.queryData = null;
    }

    componentWillMount() {
        this.queryData = Utils.parseUrlToData(this.props.location.search);
        let databaseId = this.queryData.databaseId;

        if (!this.props.entity['fields'] || !this.props.entity['fields'][databaseId] || this.props.entity['fields'][databaseId].didInvalidate) {
            this.props.fetchFieldCheckList(paramsFormat({databaseId: databaseId}));
        }
    }


    render() {
        return (
            <div key={this.props.location.pathname}>
                <MainNav />
                <DataBase { ...this.props }/>
            </div>
        );
    }
}