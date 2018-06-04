/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import {Link} from 'react-router-dom';
import Utils from '~utils'

import * as groupActions from '~actions/group';
import * as globalActions from '~actions/global';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class SubNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subNav_list: []
        }
    }

    componentWillMount() {
        let subNavType = this.props.subNavType;

        if (subNavType === 'homeList') {
            this.setState({
                subNav_list: [
                    {
                        id: 1,
                        type: 'folder',
                        cont: '项目列表',
                        pathname: '/home/pm/project',
                        chooseType: 'pm/project'
                    },
                    {
                        id: 2,
                        type: 'database',
                        cont: '数据字典',
                        pathname: '/home/pm/databases',
                        chooseType: 'pm/databases'
                    }
                ]
            })
        } else if (subNavType === 'childList') {
            this.setState({
                subNav_list: [
                    {
                        id: 3,
                        type: 'api',
                        cont: '接口文档',
                        pathname: '/project/api/list',
                        chooseType: '/project/api'
                    },
                    {
                        id: 4,
                        type: 'code-o',
                        cont: '状态码文档',
                        pathname: '/project/code/list',
                        chooseType: 'project/code'
                    }
                ]
            })
        }

    }

    goLink(path) {
        this.props.groupClear(); //清除下分组模块的搜索input为初始状态
        this.props.history.push(path)
    }

    componentDidMount() {
    }

    render() {
        const SubNav_list = this.state.subNav_list;
        const queryData = Utils.parseUrlToData(window.location.search);
        let queryPath = "";
        try {
            if (this.props.subNavType === 'childList') {
                queryPath = '?projectId=' + queryData.projectId + '&groupId=-1';
            }

        } catch (e) {
            console.log('错误信息提示', e)
        }
        return (
            <div className='subNav'>
                <ul className='clearfix'>
                    {
                        SubNav_list.map((data) => {

                            return <div key={'subNav-' + data.id} onClick={this.goLink.bind(this, data.pathname + queryPath)}>
                                        <li className={window.location.pathname.indexOf(data.chooseType) > -1 ? 'subNavChoose' : ''}>
                                            <Icon type={data.type}/><span>{data.cont}</span>
                                        </li>
                                    </div>
                        })
                    }
                </ul>
            </div>
        )
    }
}
SubNav.propTypes = {
    subNavType: PropTypes.string.isRequired
};

export default connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...groupActions}, dispatch)
)(SubNav)
