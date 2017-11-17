/**
 * Created by Cray on 2017/7/20.
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import * as globalActions from '~actions/global';
import  MainNav  from '~components/common/MainNav';
import { Dropdown, Menu, Button } from 'antd';
import {canvasAnt} from '~utils/canvasAnt';
import Logo from '../../assets/images/logo.png';

@connect(
    state => state,
    dispatch => bindActionCreators({...globalActions}, dispatch)
)
export default class Home extends React.Component {

    componentDidMount(){
        canvasAnt("indexBox");
    }

    render() {
        const menu = (
            <Menu className='indexMenuLists'>
                <Menu.Item key="2">
                    <Link to="/home/pm/project">查看项目列表</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/home/pm/databases">查看数据库列表</Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <div id='indexBox'>
                <MainNav/>
                <img className='logo' src={ Logo } alt=""/>
                <Dropdown overlay={menu} placement="bottomLeft" trigger={['hover']}>
                    <Button className='menuListBtn'>项目管理</Button>
                </Dropdown>
            </div>
        )
    }
}

Home.propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};


