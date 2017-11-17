/**
 * Created by Cray on 2017/7/20.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import Utils from '~utils/index';
import {paramsFormat} from '~common/http';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as groupActions from '~actions/group';
import * as globalActions from '~actions/global';
import Dialog from '~components/common/Dialog';

import {Icon, Modal, Input, notification,Message} from 'antd';


@connect(
    state => state,
    dispatch => bindActionCreators({...globalActions, ...groupActions}, dispatch)
)
export default class ProjectSubnav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subNav_list: [],
            width: '240px',
            nav_info: '接口',
            titleWord: '分组',
            group_status: 'interface', // api code dataBase
            group_editBox_displayCount: -1,
            projectNavStatus: 'none', //block : 打开 ； none : 关闭
            pathName: '',
            NavBg: '',
            add_visible: false,
            addInputVal: '',
            modalTitle: '新增分组',
            queryData: Utils.parseUrlToData(window.location.search), //包含 databaseId projectId
            groupId: '',
        }
    }

    componentWillMount() {
        let databaseId = this.state.queryData.databaseId || '';
        let projectId = this.state.queryData.projectId || '';
        let items = [];
        let jurisdiction = true;
        let tempID = databaseId || projectId;

        if (!this.props.entity['groups'] || !this.props.entity['groups'][tempID] || this.props.entity['groups'][tempID].didInvalidate) {
            this.props.fetchGroupCheckList(paramsFormat({databaseId, projectId}));
        }


        const {projects, databases} = this.props.entity;

        this.props.groupClear(); //清除下 初始状态
        if (window.location.pathname.indexOf('api') > -1) {
            try {
                items = _.filter(projects['items'], ['_id', projectId]);
                jurisdiction = _.includes(items[0]['cooperGroup'], this.props.user.userId) ? true : false;
                console.log(jurisdiction)
            } catch (e) {

            }

            this.setState({
                nav_info: '接口',
                group_status: 'interface',
                titleWord: '分组',
                pathName: '/project/api/list?projectId=' + projectId + '&groupId=',
                jurisdiction
            })

        } else if (window.location.pathname.indexOf('code') > -1) {
            try {
                items = _.filter(projects['items'], ['_id', projectId]);
                jurisdiction = _.includes(items[0]['cooperGroup'], this.props.user.userId) ? true : false;
            } catch (e) {

            }
            this.setState({
                nav_info: '状态码',
                group_status: 'scode',
                titleWord: '分组',
                pathName: '/project/code/list?projectId=' + projectId + '&groupId=',
                jurisdiction
            })
        } else if (window.location.pathname.indexOf('database') > -1) {
            try {
                items = _.filter(databases['items'], ['_id', databaseId]);
                jurisdiction = _.includes(items[0]['admin'], this.props.user.userId) ? true : false;
            } catch (e) {

            }
            this.setState({
                nav_info: '表',
                titleWord: '表',
                group_status: 'database',
                pathName: '/database/list?databaseId=' + databaseId + '&groupId=',
                jurisdiction
            })
        }

    }

    changeNavWidth() {

        let navWidth = '240px'
        let projectNavStatus = 'none'
        if (this.state.width === '240px') {
            navWidth = '40px'
            projectNavStatus = 'block'
        }
        this.setState({
            width: navWidth,
            projectNavStatus
        })
        this.props.groupResize(navWidth);
    }

    search_changeHander(e) {
        this.props.groupSearch(e.target.value);
    }

    changeNavBg_clickHandler(groupIdCount, e) {
        if (groupIdCount == -1) {
            this.props.groupSearch('');
        }
        this.setState({
            NavBg: groupIdCount
        })
    }


    /**
     *  错误 弹出框
     *  */
    showConfirm(data) {
        const confirm = Modal.confirm;
        const fetchDelGroup = this.props.fetchDelGroup;
        let _this = this;
        confirm({
            title: '删除' + this.state.titleWord,
            content: '确认删除？',
            onOk() {
                fetchDelGroup(paramsFormat({
                    id: data._id,
                    databaseId: data.databaseId,
                    projectId: data.projectId
                }), (data) => {
                });
            },
            onCancel() {
            }
        });
    }

    /**
     *  icon 鼠标点击 弹出修改删除
     *  */
    iconAlert_clickHandler(index) {
        this.setState({
            group_editBox_displayCount: index
        })
    }

    /**
     *  icon 鼠标移除 隐藏修改删除
     *  */
    group_editBoxHide_mouseLeaveHandler() {
        this.setState({
            group_editBox_displayCount: -1
        })
    }

    /**
     *  添加按钮 弹出框 出现
     *  */
    add_modalBoxShow_clickHandler(pageType,data) {

        let grounpId,
            name,
            databaseId = this.state.queryData.databaseId || '',
            projectId = this.state.queryData.projectId || '',
            type = this.state.group_status || 'interface';

        if(pageType == 'eidt'){
            grounpId = data._id;
            name = data.addInputVal;
        }

        this.refs.getDialog.confirm({
            title:(pageType == 'eidt'?'修改':'新增') + this.state.titleWord,
            content:<div>
                        <span>{this.state.titleWord}名 ：</span>
                        <Input maxLength="32" defalutValue={name} id="navInputVal"
                               placeholder="1 ~ 32 位字符串"
                               prefix={<Icon type="file" style={{fontSize: 13}}/>}
                               style={{fontSize: 13, marginTop: '10px'}}/>

                    </div>,
            onOk:()=>{

                let name = Utils.getValueById("navInputVal");

                if(!name||name.length<1||name.length>32){
                    Message.error("请输入1-32的"+this.state.titleWord+"名称");
                    return false;
                }

                let opt = {databaseId, projectId, name, type}
                if (grounpId) {
                    opt.id = grounpId
                }

                this.props.fetchUpdateAddGroup(paramsFormat(opt), (data) => {
                    Utils.setValueById("navInputVal", "");
                });

            },
            onCancel:()=>{
                Utils.setValueById("navInputVal", "");
            }

        })


    }

    /**
     * 删除 组
     */
    delGroup_clickHandler(data) {
        this.showConfirm(data)
    }


    /**
     *  处理数据
     *  */
    dealData() {
        const queryData = this.state.queryData;
        const {groups} = this.props.entity;

        let data = [];
        try {
            if (groups[queryData.projectId] || groups[queryData.databaseId]) {
                let groupData = groups[queryData.projectId] || groups[queryData.databaseId];
                data = _.filter(groupData['items'], ['type', this.state.group_status]);
            }
        } catch (e) {

        }

        return data;
    }

    render() {
        let groupData = this.dealData();
        const queryData = this.state.queryData;

        let recycle_dataBtn_display = this.state.group_status === 'interface' ? 'block' : 'none';
        let SubnavClass = this.state.group_status === 'database' ? 'dabaseClass ProjectSubnav' : 'ProjectSubnav';
        let asideTitle = this.state.titleWord;
        let NavBg = this.state.NavBg || queryData.groupId
        if (groupData[0] && this.state.group_status === 'database') {
            NavBg = groupData[0]['_id']
        }

        return (
            <div className={SubnavClass} style={{'width': this.state.width}}>

                <header onClick={this.changeNavWidth.bind(this)}>●●●</header>

                <div className="closeMb" style={{'display': this.state.projectNavStatus}}></div>
                <div className="searchBox">
                    <Input
                        id='searchId'
                        placeholder="请输入搜索内容"
                        style={{width: 220}}
                        onChange={this.search_changeHander.bind(this)}
                    />
                </div>
                <aside>
                    <div className='asideTitleBox'>
                        <span className='asideTitle'>{asideTitle}</span>
                        <span className='aside_addBtn' style={{'display': this.state.jurisdiction ? 'block' : 'none'}}
                              onClick={this.add_modalBoxShow_clickHandler.bind(this,'add')}>
                            <Icon type="plus" className='addIcon'/>
                            添加
                        </span>
                    </div>
                    <div className="asideBox">
                        <div className="asideCont">
                            <Link to={this.state.pathName + '-1'}
                                  style={{display: this.state.group_status === 'database' ? 'none' : 'block'}}>
                                <div className="all_dataBtn"
                                     onClick={this.changeNavBg_clickHandler.bind(this, '-1')}
                                     style={{'background': NavBg === '-1' ? '#fafafa' : ''}}>
                                    <Icon type="bars"/>
                                    <span>所有{this.state.nav_info}</span>
                                </div>
                            </Link>
                            <Link to={this.state.pathName + '-2'}>
                                <div className="recycle_dataBtn"
                                     onClick={this.changeNavBg_clickHandler.bind(this, '-2')}
                                     style={{
                                         display: recycle_dataBtn_display,
                                         'background': NavBg === '-2' ? '#fafafa' : ''
                                     }}>
                                    <Icon type="delete"/>
                                    <span>接口回收站</span>
                                </div>
                            </Link>
                            <div className='api_group'>
                                {
                                    groupData && (() => {
                                        return (
                                            groupData.map((data, index) => {
                                                return (
                                                    <Link key={data._id} to={this.state.pathName + data._id}>
                                                        <div className="group_name"
                                                             onClick={this.changeNavBg_clickHandler.bind(this, data._id)}
                                                             style={{'background': NavBg === data._id ? '#fafafa' : ''}}>
                                                            <span className='group_name_title'
                                                                  title={data.name}>{data.name}</span>
                                                            <Icon type="bars" className='group_icon'
                                                                  style={{'display': this.state.jurisdiction ? 'block' : 'none'}}
                                                                  onClick={this.iconAlert_clickHandler.bind(this, index)}/>
                                                            <div className='group_editBox'
                                                                 onMouseLeave={this.group_editBoxHide_mouseLeaveHandler.bind(this)}
                                                                 style={{'display': this.state.group_editBox_displayCount === index && this.state.jurisdiction ? 'block' : 'none'}}>
                                                                <div className='group_editBtn group_btn'
                                                                     onClick={this.add_modalBoxShow_clickHandler.bind(this,'eidt', data)}>
                                                                    修改
                                                                </div>
                                                                <div className='group_delBtn group_btn'
                                                                     onClick={this.delGroup_clickHandler.bind(this, data)}>
                                                                    删除
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                )
                                            })
                                        )
                                    })()
                                }
                            </div>
                        </div>
                    </div>
                </aside>

                <Dialog ref="getDialog"></Dialog>

            </div>
        )
    }
}
ProjectSubnav.propTypes = {
    // fetchDelInterface:PropTypes.any.isRequired
};