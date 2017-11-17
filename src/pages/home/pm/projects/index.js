/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as globalActions from '~actions/global';
import * as projectActions from '~actions/project';
import PropTypes from 'prop-types';
import {paramsFormat} from '~common/http';
import  SubNav  from '~components/common/SubNav';
import  ProjectContainer  from '~containers/home/ProjectContainer';
import  MainNav  from '~components/common/MainNav';

@connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...projectActions}, dispatch)
)
export default class Projects extends React.Component {

    componentWillMount() {
        if (!this.props.entity['projects'] || this.props.entity['projects'].didInvalidate) {
            this.props.fetchProjectCheckList(paramsFormat({}));
        }
    }

    render() {
        return (
            <div>
                <MainNav/>
                <SubNav subNavType='homeList'/>
                <ProjectContainer { ...this.props }/>
            </div>
        )

    }
}

Projects.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};