/**
 * Created by chy on 2017/7/31.
 */
import React from 'react';
import {connect} from 'react-redux';
import { Icon, Dropdown, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { logOut } from '~common/http';
import Logo from '../../assets/images/apidocIcon.png'


class MainNav extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false
        }
    }

    handleMenuClick(e){
        if (e.key === '1') {
            this.setState({ visible: true });
            this.handleVisibleChange(true);
        }else if(e.key === '100'){
            logOut();
            this.handleVisibleChange(false);
        }else {
            this.handleVisibleChange(false);
        }
    }
    handleVisibleChange(flag) {
        this.setState({ visible: flag });
    }
    render() {
        const {auth, username} = this.props.user;
        const menu = auth > 0 ? (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                <Menu.Item className='navUserName' key="1">
                    { username }
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="2">
                    <Link to="/home/user">账号管理</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to="/home/user/register">注册账号</Link>
                </Menu.Item>

                <Menu.Item key="4">
                    <Link to="/home/user/manager">用户管理</Link>
                </Menu.Item>
                <Menu.Item key="100">
                    退出登录
                </Menu.Item>
            </Menu>
        ) : (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                <Menu.Item className='navUserName' key="1">
                    { username }
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="2">
                    <Link to="/home/user">账号管理</Link>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="100">
                    退出登录
                </Menu.Item>
            </Menu>
        );
        return (
            <div className='mainNav'>
                <Link className='apicode' to="/"><img src={ Logo } alt="logo"/></Link>
                <Link to="/home/pm/project" className='projectManageBtn navActive'><span ><Icon type="inbox" className='inbox' />项目管理</span></Link>
                <Link to="/tool" className='projectManageBtn navActive'><span ><Icon type="appstore" className='inbox' />小工具</span></Link>
                <Dropdown overlay={menu} placement="bottomLeft" onVisibleChange={this.handleVisibleChange.bind(this)} visible={this.state.visible}>
                    <Button className='userInfoMenu'><Icon type="menu-fold" /></Button>
                </Dropdown>
            </div>
        )
    }
}

export default connect(
    state => state)(MainNav)