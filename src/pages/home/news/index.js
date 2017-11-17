/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import  MainNav  from '~components/common/MainNav';

@connect(
    state => state,
    dispatch => bindActionCreators(globalActions, dispatch)
)
export default class News extends React.Component {

    componentWillMount() {
    }

    componentDidMount(){

    }

    render() {
        return (
            <div>
                <MainNav/>
                news
            </div>
        );
    }
}