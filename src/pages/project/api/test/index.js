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



@connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...interfaceActions, ...testenvActions}, dispatch)
)
export default class ApiTests extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

        if (!this.props.entity['testenv'] || this.props.entity['testenv'].didInvalidate) {
            this.props.fetchTestEnvCheckList(paramsFormat({}));
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